"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Search, Database, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useData } from './context';

export default function VoiceAssistant() {
  const router = useRouter();
  const { data, fetchData } = useData();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Tap the microphone to issue voice commands');
  const [isCommandMatch, setIsCommandMatch] = useState(false);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setStatusMessage('Speech recognition is not supported in this browser. Try Google Chrome.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-IN'; // Optimize for English with Indian locale/accent

    rec.onstart = () => {
      setIsListening(true);
      setIsCommandMatch(false);
      setShowConfirmPrompt(false);
      setTranscript('');
      setAiResponse('');
      setStatusMessage('Listening to your voice command...');
    };

    rec.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      setShowConfirmPrompt(true);
      setStatusMessage("Transcribed. Review text and click 'Confirm & Send'.");
    };

    rec.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setStatusMessage('Microphone access denied. Please allow microphone permissions in the browser settings.');
      } else {
        setStatusMessage(`Speech Error: ${event.error}. Click mic to try again.`);
      }
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;

    // Developer test helper to simulate speech transcription from the console
    const handleMockSpeech = (e) => {
      const mockText = e.detail;
      setTranscript(mockText);
      setShowConfirmPrompt(true);
      setStatusMessage("Transcribed. Review text and click 'Confirm & Send'.");
    };

    window.addEventListener('mock-speech', handleMockSpeech);
    return () => {
      window.removeEventListener('mock-speech', handleMockSpeech);
    };
  }, []);

  // Temporary test hook to check layout via ?mockSpeech=true
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('mockSpeech=true')) {
      setTranscript("what is today's profit");
      setShowConfirmPrompt(true);
      setStatusMessage("Transcribed. Review text and click 'Confirm & Send'.");
    }
  }, []);

  const toggleListen = () => {
    if (!isSupported) return;
    
    // Stop speaking if active
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        setShowConfirmPrompt(false);
        setAiResponse('');
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const speak = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const processCommand = async (rawText) => {
    const text = rawText.toLowerCase().trim();
    setIsCommandMatch(true);
    setAiResponse("Processing command...");
    setStatusMessage("Sending voice transcript to n8n...");
    setIsSpeaking(true); // Activate waveform speaking state

    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: rawText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';

      // 1. If response is binary audio (e.g. from an OpenAI/ElevenLabs TTS node in n8n)
      if (contentType.includes('audio')) {
        const responseTextHeader = response.headers.get('X-Response-Text');
        if (responseTextHeader) {
          const originalText = decodeURIComponent(responseTextHeader);
          setAiResponse(originalText);
          setStatusMessage(`n8n response: "${originalText}"`);
        } else {
          setAiResponse("Playing voice audio response from n8n...");
          setStatusMessage("n8n audio response received. Playing back...");
        }
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onplay = () => {
          setIsSpeaking(true);
        };
        audio.onended = () => {
          setIsSpeaking(false);
          setStatusMessage("AI voice agent audio completed.");
        };
        audio.onerror = (e) => {
          console.error("Audio playback error:", e);
          setIsSpeaking(false);
          setStatusMessage("Failed to play n8n audio output.");
        };
        
        await audio.play();
        return;
      }

      // 2. If response is JSON
      if (contentType.includes('application/json')) {
        const data = await response.json();
        
        if (data.error) {
          // If n8n is unconfigured in env, automatically fallback to local offline matches
          if (data.error.includes('N8N_WEBHOOK_URL is not configured')) {
            console.log("n8n Webhook URL is unconfigured. Falling back to local command logic.");
            processLocalCommand(rawText);
            return;
          }
          throw new Error(data.error);
        }

        const replyText = data.text || data.message || data.output || data.response || '';
        if (replyText) {
          setAiResponse(replyText);
          setStatusMessage(`n8n: "${replyText}"`);
          speak(replyText);
          
          // Auto-navigate client if response suggests routing
          const replyTextLower = replyText.toLowerCase();
          if (replyTextLower.includes('navigat') || replyTextLower.includes('switch page') || replyTextLower.includes('database') || replyTextLower.includes('data manager')) {
            if (replyTextLower.includes('data') || replyTextLower.includes('database')) {
              setTimeout(() => router.push('/data'), 2000);
            }
          }
        } else {
          setAiResponse("Received empty reply payload from n8n.");
          setStatusMessage("Received empty reply payload from n8n.");
          setIsSpeaking(false);
        }
        return;
      }

      // 3. Fallback: text response
      const rawResponseText = await response.text();
      if (rawResponseText) {
        setAiResponse(rawResponseText);
        setStatusMessage(`n8n: "${rawResponseText}"`);
        speak(rawResponseText);
      } else {
        setAiResponse("Webhook response loaded successfully.");
        setStatusMessage("Webhook response loaded successfully.");
        setIsSpeaking(false);
      }

    } catch (err) {
      console.warn("n8n connection failed, using local offline processor. Detail:", err.message);
      processLocalCommand(rawText);
    }
  };

  // Local Offline Commands fallback
  const processLocalCommand = (rawText) => {
    const text = rawText.toLowerCase().trim();
    setIsCommandMatch(true);

    // 1. Navigation intents
    if (
      text.includes('go to data') || 
      text.includes('manage data') || 
      text.includes('open data') || 
      text.includes('database') || 
      text.includes('table') || 
      text.includes('ledger') || 
      text.includes('inventory')
    ) {
      const resp = "Navigating to the Database Manager page.";
      speak(resp);
      setAiResponse(resp);
      setStatusMessage("Offline match: Navigation. Opening Data Manager...");
      setTimeout(() => {
        router.push('/data');
      }, 1000);
      return;
    }

    if (
      text.includes('go to analytics') || 
      text.includes('overview') || 
      text.includes('home') || 
      text.includes('main page')
    ) {
      const resp = "You are already viewing the Analytics overview page.";
      speak(resp);
      setAiResponse(resp);
      setStatusMessage("Offline match: Navigation. Already on Analytics home.");
      return;
    }

    // 2. Sync intents
    if (
      text.includes('refresh') || 
      text.includes('sync') || 
      text.includes('reload') || 
      text.includes('fetch')
    ) {
      const resp = "Synchronizing dashboard stats with your live Google Sheet now.";
      speak(resp);
      setAiResponse(resp);
      setStatusMessage("Offline match: Sync database. Syncing sheets...");
      fetchData(false);
      return;
    }

    // 3. KPI query intents
    if (text.includes('profit') || text.includes('net profit') || text.includes('earnings')) {
      const profit = data.kpis.todaysProfit;
      const speech = `Today's net profit margin is ${profit > 0 ? Math.round(profit) : 0} rupees.`;
      speak(speech);
      setAiResponse(speech);
      setStatusMessage(`Offline match: Today's Profit inquiry. Reading value...`);
      return;
    }

    if (text.includes('revenue') || text.includes('sales revenue') || text.includes('income')) {
      const revenue = data.kpis.todaysRevenue;
      const speech = `Today's gross revenue totals ${revenue > 0 ? Math.round(revenue) : 0} rupees.`;
      speak(speech);
      setAiResponse(speech);
      setStatusMessage(`Offline match: Today's Revenue inquiry. Reading value...`);
      return;
    }

    if (text.includes('stock value') || text.includes('valuation') || text.includes('stock valuation') || text.includes('inventory value')) {
      const valuation = data.kpis.totalStockValue;
      const speech = `The total cost valuation of your current stock is ${Math.round(valuation)} rupees.`;
      speak(speech);
      setAiResponse(speech);
      setStatusMessage(`Offline match: Stock Valuation inquiry. Reading value...`);
      return;
    }

    if (text.includes('low stock') || text.includes('shortage') || text.includes('restock')) {
      const count = data.kpis.lowStockCount;
      const speech = count > 0 
        ? `You currently have ${count} items running below safe stock levels.` 
        : "All inventory items are currently at safe stock levels.";
      speak(speech);
      setAiResponse(speech);
      setStatusMessage(`Offline match: Low Stock inquiry. Reading value...`);
      return;
    }

    // Help command
    if (text.includes('help') || text.includes('suggest') || text.includes('what can i say')) {
      const resp = "You can say: profit today, navigate to database, or sync spreadsheet.";
      speak(resp);
      setAiResponse(resp);
      setStatusMessage("Suggestions read aloud.");
      return;
    }

    // Command didn't match intents
    setIsCommandMatch(false);
    const fallbackResp = `I heard "${rawText}". Try saying: profit today, or navigate to database.`;
    speak(fallbackResp);
    setAiResponse(fallbackResp);
    setStatusMessage("Incomplete query. Choose a shortcut below or speak again.");
  };

  const handleSuggestionClick = (phrase) => {
    setTranscript(phrase);
    setShowConfirmPrompt(false);
    processCommand(phrase);
  };

  return (
    <div className={`campaign-speaker-card ${isListening ? 'active' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', justifyContent: 'space-between', minHeight: '320px', transition: 'all 0.3s ease' }}>
      
      {/* Card Header */}
      <div className="campaign-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span className="campaign-tag">Voice Agent Speaker</span>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
            Active Session
            <span className="wave-kpi-status-dot"></span>
          </h2>
        </div>
        
        {/* Dynamic Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className={`sync-dot ${isListening ? 'syncing' : ''}`} style={{
            width: '6px',
            height: '6px',
            backgroundColor: isListening ? 'var(--rose)' : 'var(--emerald)',
            borderRadius: '50%'
          }}></span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
            {isListening ? 'Active' : 'Standby'}
          </span>
        </div>
      </div>

      {/* Horizontally Extended Speaker Button */}
      <div style={{ width: '100%' }}>
        <button 
          className={`speaker-mic-btn ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
          onClick={toggleListen}
          disabled={!isSupported}
          title={isListening ? 'Stop Listening' : 'Click to Speak'}
        >
          {isListening ? (
            <>
              <Mic size={16} />
              <span>Active Listening... Tap to Stop</span>
            </>
          ) : isSpeaking ? (
            <>
              <Volume2 size={16} />
              <span>AI Speaker Talking...</span>
            </>
          ) : (
            <>
              <MicOff size={16} />
              <span>Tap to Start Voice Agent</span>
            </>
          )}
        </button>
        <p style={{ fontSize: '0.72rem', opacity: 0.8, color: '#ffffff', marginTop: '0.4rem', textAlign: 'center' }}>
          {statusMessage}
        </p>
      </div>

      {/* Voice Shortcuts */}
      <div>
        <div className="speaker-suggestions-title">Voice Shortcuts</div>
        <div className="speaker-suggestion-pills">
          <button className="speaker-suggestion-pill" onClick={() => handleSuggestionClick("Read today's profit")}>
            Profit Today
          </button>
          <button className="speaker-suggestion-pill" onClick={() => handleSuggestionClick("Read today's revenue")}>
            Revenue Today
          </button>
          <button className="speaker-suggestion-pill" onClick={() => handleSuggestionClick("What is the stock value?")}>
            Stock Valuation
          </button>
        </div>
      </div>

      {/* Search Command Input */}
      <div style={{ position: 'relative', width: '100%' }}>
        <input 
          type="text"
          className="form-input"
          placeholder="Speak or type store command..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && transcript) {
              processCommand(transcript);
            }
          }}
          style={{
            width: '100%',
            background: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            padding: '0.65rem 1rem',
            fontFamily: 'var(--font-family)',
            fontSize: '0.9rem',
            boxShadow: 'none'
          }}
        />
      </div>

      {/* Confirmation prompt for manual mic inputs */}
      {showConfirmPrompt && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '-0.25rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setTranscript('');
              setShowConfirmPrompt(false);
              setStatusMessage('Tap the microphone to issue voice commands');
            }}
            style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: 'none' }}
          >
            Discard
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setShowConfirmPrompt(false);
              processCommand(transcript);
            }}
            style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: '#ffffff', color: 'var(--campaign-bg)', border: 'none' }}
          >
            Confirm
          </button>
        </div>
      )}

      {/* DYNAMIC TRANSCRIPTION AREA BELOW SPEAKER (expands height dynamically) */}
      {(transcript || aiResponse) && (
        <div style={{ 
          marginTop: '0.5rem',
          paddingTop: '0.75rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.6rem',
          transition: 'all 0.3s ease'
        }}>
          {transcript && (
            <div style={{ background: 'rgba(255, 255, 255, 0.12)', borderRadius: '10px', padding: '0.5rem 0.75rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, display: 'block', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Spoken input</span>
              <p style={{ fontSize: '0.82rem', color: '#ffffff', margin: 0 }}>"{transcript}"</p>
            </div>
          )}
          {aiResponse && (
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '0.5rem 0.75rem', borderLeft: '3px solid #22c55e' }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, display: 'block', textTransform: 'uppercase', marginBottom: '0.15rem' }}>AI Response</span>
              <p style={{ fontSize: '0.82rem', color: '#ffffff', margin: 0 }}>{aiResponse}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
