const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// 1. Initialize PDF Document (A4 size: 595.28 x 841.89 points)
const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: true });
const outputFilePath = path.join(process.cwd(), 'Smart_Store_User_Guide.pdf');
const stream = fs.createWriteStream(outputFilePath);
doc.pipe(stream);

// Color Palette Definition for a high-tech corporate appearance
const colors = {
  primaryBg: '#0b0f19',    // Midnight Dark (Pitch style)
  accentGreen: '#10b981',  // Emerald Green
  accentBlue: '#3b82f6',   // Electric Blue
  accentRose: '#f43f5e',   // Rose Red
  lightBlue: '#eff6ff',    // Card Background Light Blue
  borderBlue: '#bfdbfe',   // Light Blue Border
  textDark: '#1e293b',     // Text Dark Grey
  textLight: '#f8fafc',    // Text Light Grey
  textMuted: '#64748b',    // Muted grey text
  borderLight: '#e2e8f0',  // Light grey border
  cardBgGrey: '#f8fafc',   // Card background grey
  alertRedBg: '#fff1f2',   // Red alert box bg
  alertRedBorder: '#fecdd3',
  alertRedText: '#be123c',
  alertAmberBg: '#fffbeb', // Amber alert box bg
  alertAmberBorder: '#fef3c7',
  alertAmberText: '#b45309'
};

// ----------------------------------------------------
// PAGE 1: TITLE / COVER PAGE (THE HACKATHON PITCH)
// ----------------------------------------------------
// Midnight dark header block
doc.rect(0, 0, 595.28, 290).fill(colors.primaryBg);
doc.rect(0, 287, 595.28, 6).fill(colors.accentGreen);

// Project Title & Subtitle
doc.font('Helvetica-Bold').fontSize(38).fillColor(colors.textLight)
   .text('AuraRetail', 50, 75);
doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.accentGreen)
   .text('THE OFFLINE-FIRST VOICE AI RETAIL CONTROL LAYER', 50, 125);
doc.font('Helvetica-Oblique').fontSize(10).fillColor(colors.textMuted)
   .text('A Unified Next.js Analytics Portal Bridging Familiar Cloud Sheets with Natural Speech Interfaces', 50, 145);

// Value Proposition Badges
const drawBadge = (x, y, text, color) => {
  doc.rect(x, y, 90, 18).fill(color);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(colors.textLight)
     .text(text, x, y + 5, { width: 90, align: 'center' });
};
drawBadge(50, 175, 'OFFLINE-FIRST', colors.accentBlue);
drawBadge(150, 175, 'VOICE AGENT AI', colors.accentGreen);
drawBadge(250, 175, 'GOOGLE SHEETS CORE', colors.accentRose);

// Submission Details for Judges
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textLight)
   .text('Why this project stands out:', 50, 215);
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(colors.accentGreen)
   .text('• Zero-overhead database setup: Google Sheets is your production database.', 50, 230);
doc.text('• Voice-controlled operations: Hands-free database query, sync, and client-side navigation.', 50, 245);
doc.text('• Fail-safe offline caching: Seamlessly switches to local mock DB during connectivity dropouts.', 50, 260);

// Page Title Content Area
doc.font('Helvetica-Bold').fontSize(12).fillColor(colors.textDark)
   .text('PROJECT OVERVIEW & CORE PILLARS', 50, 320);
doc.moveTo(50, 335).lineTo(545, 335).strokeColor(colors.borderLight).lineWidth(1).stroke();

// Grid Cards on Cover Page
const drawCoverCard = (x, y, w, h, title, desc, tag) => {
  doc.rect(x, y, w, h).fill(colors.cardBgGrey);
  doc.rect(x, y, w, h).strokeColor(colors.borderLight).lineWidth(1).stroke();
  
  doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.accentBlue)
     .text(title, x + 15, y + 15);
  doc.font('Helvetica-Bold').fontSize(7).fillColor(colors.accentGreen)
     .text(tag, x + 15, y + 28);
  doc.font('Helvetica').fontSize(8.5).fillColor(colors.textDark)
     .text(desc, x + 15, y + 42, { width: w - 30, lineGap: 2.5 });
};

drawCoverCard(50, 355, 235, 140, 
  '1. THE REVOLUTIONARY PROBLEM', 
  'Small store owners are trapped between complex, expensive ERP software they do not understand and messy, paper logbooks that get damaged and fail to calculate margins or expiry warnings.',
  'TARGET USER PAIN POINT'
);

drawCoverCard(310, 355, 235, 140, 
  '2. VOICE COMMAND AUTOMATION', 
  'Captures browser microphone speech, transcribes, and forwards it to n8n AI workflows. Synthesizes responses using Google Translate TTS backend to speak directly to the shopkeeper.',
  'INTELLIGENT UI PIPELINE'
);

drawCoverCard(50, 510, 235, 140, 
  '3. MULTI-LEVEL RESILIENCE', 
  'No network? No credentials? No problem. The dashboard instantly detects Sheets connection offline status, shifting all operations to a local cache ledger file without interrupting business flow.',
  'BULLETPROOF OFFLINE CACHING'
);

drawCoverCard(310, 510, 235, 140, 
  '4. SAFE TRANSACTION LEDGER', 
  'Inline cell editing, batched changes buffering, and a single-row editing safety lock prevent database race-conditions. Auto-populates item specifications and prices to bypass manual errors.',
  'DATABASE MANAGEMENT ENGINE'
);

// Metadata Block at Cover Bottom
doc.rect(50, 680, 495, 60).fill(colors.cardBgGrey);
doc.rect(50, 680, 495, 60).strokeColor(colors.borderLight).lineWidth(1).stroke();

doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.textMuted)
   .text('AUDIENCE: HACKATHON EVALUATION PANEL', 65, 695);
doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.textMuted)
   .text('TECH STACK: NEXT.JS, GOOGLE APIS, N8N, TTS', 235, 695);
doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.textMuted)
   .text('RATING: TARGET GRAND PRIZE', 435, 695);


// ----------------------------------------------------
// PAGE 2: THE REAL-WORLD PROBLEM & THE SYSTEM PITCH
// ----------------------------------------------------
doc.addPage();

// Heading
doc.font('Helvetica-Bold').fontSize(16).fillColor(colors.textDark).text('1. The Real-World Problem & Solution Pitch', 40, 70);
doc.moveTo(40, 90).lineTo(555, 90).strokeColor(colors.borderLight).lineWidth(1).stroke();

// The Problem Section
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentRose).text('THE PROBLEM WE SOLVE: RETAIL MANAGEMENT IS BROKEN', 40, 115);
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark).text(
  'Local mom-and-pop shops and small retail stores handle dozens of transactions daily. However, they face a critical dilemma:\n\n' +
  '1. Paper Logbooks are inefficient, easily lost or destroyed, and provide zero calculations of profitability, margin percentages, or stock valuation.\n' +
  '2. Traditional Spreadsheets are too complex, look cluttered on small screens, and are prone to data-entry mistakes (like entering letters in a price column or mismatched unit descriptions).\n' +
  '3. Enterprise ERP Systems are prohibitively expensive, require extensive training, and need massive processing power.\n' +
  '4. Product Expiry & Low Stock lead to massive waste and lost sales because shopkeepers do not notice items are expiring in 4 days or dropping below 3 units until it is too late.',
  40, 130, { width: 515, align: 'justify', lineGap: 3.5 }
);

// The Solution Section
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentGreen).text('THE SOLUTION: AURARETAIL DASHBOARD', 40, 260);
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark).text(
  'AuraRetail solves this by offering a lightweight, beautiful business intelligence portal that connects directly to Google Sheets (which shop owners already know and trust) and equips them with an interactive voice agent.\n\n' +
  '• Low Cost & Zero Overhead: Uses Google Sheets as a free, scalable cloud database. No SQL servers, hosting fees, or complicated logins.\n' +
  '• Voice Assistant Core: Shopkeepers can query sales, check stock, navigation pages, or sync spreadsheet records by simply speaking to the dashboard. The system speaks the responses back naturally.\n' +
  '• Bulletproof Reliability: Real-time background checking shifts database transactions to a local cache file (lib/mock_db.json) automatically if Google Sheets APIs are offline. Operations continue uninterrupted.',
  40, 275, { width: 515, align: 'justify', lineGap: 3.5 }
);

// Uniqueness section (Rating pitch)
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentBlue).text('WHY THIS PROJECT IS UNIQUE & WINS HACKATHONS', 40, 415);

const drawUVPBullet = (title, desc, y) => {
  doc.circle(48, y + 5, 3.5).fill(colors.accentBlue);
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(colors.textDark).text(title + ':', 60, y);
  const textWidth = doc.widthOfString(title + ':');
  doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark)
     .text(desc, 65 + textWidth, y, { width: 515 - (25 + textWidth), lineGap: 2.5 });
};

drawUVPBullet('Familiarity-Driven Database', 'Instead of trying to teach operators a new, complex software, we utilize their existing Google Sheet. They edit cells in the cloud, and our app compiles the data. Changes sync instantly both ways.', 435);
drawUVPBullet('Single-Row Modification Lock', 'Prevents conflicting data entries. If a user is currently modifying values on row 5, the app locks edit access on all other rows, protecting the Google Sheets API from cell-level collision errors.', 485);
drawUVPBullet('Dual Speech Engine Pipeline', 'Integrates browser Webkit SpeechRecognition with n8n AI workflows. If n8n is offline, a local regex-based keyword search matches intents locally, reading KPIs directly from the active client state.', 535);
drawUVPBullet('Zero-Config Server-Side TTS', 'If n8n returns a text reply, our backend automatically proxies it to Google Translate API, generating a binary audio stream. The browser plays it directly, creating an interactive "talking" assistant.', 585);


// ----------------------------------------------------
// PAGE 3: ANALYTICS OVERVIEW & LIVE KPI METRICS
// ----------------------------------------------------
doc.addPage();

// Heading
doc.font('Helvetica-Bold').fontSize(16).fillColor(colors.textDark).text('2. Analytics Overview & Live KPI Metrics', 40, 70);
doc.moveTo(40, 90).lineTo(555, 90).strokeColor(colors.borderLight).lineWidth(1).stroke();

// KPIs description
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark).text(
  'The AuraRetail dashboard aggregates rows from the inventory and sales spreadsheets, computing metrics dynamically to display overall business health at a glance:',
  40, 110, { width: 515, lineGap: 3.5 }
);

// KPI Bullet points
const drawKPIBullet = (title, desc, y) => {
  doc.circle(48, y + 5, 3).fill(colors.accentGreen);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.textDark).text(title + ':', 60, y);
  const titleW = doc.widthOfString(title + ':');
  doc.font('Helvetica').fontSize(9).fillColor(colors.textDark).text(desc, 65 + titleW, y, { width: 515 - (25 + titleW), lineGap: 2 });
};

drawKPIBullet('Total Stock Value', 'Multiplies item quantities by their purchase cost to determine the total capital locked on store shelves.', 140);
drawKPIBullet('Potential Revenue', 'Aggregates stock valuation at active retail selling prices to show gross revenue potential.', 165);
drawKPIBullet('Today\'s Profit & Revenue', 'Tracks completed transactions for the current date, subtracting product cost basis to calculate net profit margins.', 190);
drawKPIBullet('Average Profit Markup', 'Calculates markups across all stock rows, giving operators insight into price optimizations.', 215);

// Interactive visual analytics
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentBlue).text('VISUAL COMPILER & COMPREHENSIVE CHARTS', 40, 250);
doc.font('Helvetica').fontSize(9).fillColor(colors.textDark).text(
  'AuraRetail integrates Recharts to map sales histories: a Revenue Trend Chart (smooth linear-gradient area curves of sales volume) and a Best-Sellers Bar Chart (ranks products by units sold or gross earnings).',
  40, 265, { width: 515, lineGap: 3 }
);

// SCREENSHOT 1: DASHBOARD OVERVIEW
doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.textDark).text('PROJECT SCREENSHOT: REAL-TIME ANALYTICS OVERVIEW', 40, 320);

const screenshot1Path = path.join(process.cwd(), 'dashboard_overview.png');
if (fs.existsSync(screenshot1Path)) {
  doc.rect(38, 338, 519, 244).strokeColor(colors.textMuted).lineWidth(1).stroke();
  doc.image(screenshot1Path, 40, 340, { width: 515, height: 240 });
  doc.font('Helvetica-Oblique').fontSize(8).fillColor(colors.textMuted)
     .text('Figure 1: UI showing live KPI metrics, dynamic red/amber expiry banners, revenue curves, and best-seller charts.', 40, 590, { width: 515, align: 'center' });
} else {
  doc.rect(40, 340, 515, 200).fill(colors.cardBgGrey);
  doc.font('Helvetica').fontSize(10).fillColor(colors.textMuted).text('[Overview Screenshot Image Not Found]', 40, 430, { width: 515, align: 'center' });
}

// Critical Alerts Section
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentRose).text('CRITICAL AUTO-CHECKER & ALERT BANNERS', 40, 620);
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark).text(
  'In the background, a validation engine constantly parses the dates and numbers. It triggers immediate alert flags in the main dashboard:\n' +
  '• Critical Expiry Banners: High alert (Red) if product expiry date is < 7 days away. Warning (Amber) if < 30 days.\n' +
  '• Critical Shortage Banners: Triggers when product stock levels drop below 3 units, preventing inventory stockouts.',
  40, 635, { width: 515, lineGap: 3.5 }
);


// ----------------------------------------------------
// PAGE 4: SAFE DATABASE MANAGER & SHEETS INTEGRATION
// ----------------------------------------------------
doc.addPage();

// Heading
doc.font('Helvetica-Bold').fontSize(16).fillColor(colors.textDark).text('3. Safe Database Manager & Sheets Integration', 40, 70);
doc.moveTo(40, 90).lineTo(555, 90).strokeColor(colors.borderLight).lineWidth(1).stroke();

// Description
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentBlue).text('SPREADSHEET-STYLE DATA ENTRY & LOCK SAFETY', 40, 110);
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark).text(
  'The "Manage Data" panel bridges direct cell manipulations with Google Sheets APIs. It is built to mimic the ease of standard spreadsheet editing while introducing data-entry validation checks and database collision safety locks:',
  40, 125, { width: 515, lineGap: 3.5 }
);

// Safety bullets
const drawSafetyBullet = (num, title, desc, y) => {
  doc.rect(40, y, 16, 16).fill(colors.accentBlue);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(colors.textLight).text(num, 40, y + 4, { width: 16, align: 'center' });
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(colors.textDark).text(title, 65, y + 2);
  const titleW = doc.widthOfString(title);
  doc.font('Helvetica').fontSize(9).fillColor(colors.textDark).text(' - ' + desc, 65 + titleW, y + 2, { width: 515 - (30 + titleW), lineGap: 2 });
};

drawSafetyBullet('1', 'Unsaved Changes Highlight', 'Double-clicking cells opens an inline input. Edited values are stored in a client state buffer (pendingChanges) and cells are highlighted in yellow until saved.', 175);
drawSafetyBullet('2', 'Transaction Collision Prevention', 'Enforces edit isolation. Operators are blocked from editing details on Row 6 if they have unsaved edits on Row 4, protecting sheets from overlapping save overwrites.', 215);
drawSafetyBullet('3', 'Dynamic Form Auto-completion', 'Adding a sale pre-populates unit descriptions and fetches active inventory selling prices, calculating transaction totals dynamically to prevent arithmetic errors.', 255);

// SCREENSHOT 2: DATA MANAGER
doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.textDark).text('PROJECT SCREENSHOT: DUAL-TAB DATA MANAGER & INLINE EDITING', 40, 310);

const screenshot2Path = path.join(process.cwd(), 'data_manager.png');
if (fs.existsSync(screenshot2Path)) {
  doc.rect(38, 328, 519, 244).strokeColor(colors.textMuted).lineWidth(1).stroke();
  doc.image(screenshot2Path, 40, 330, { width: 515, height: 240 });
  doc.font('Helvetica-Oblique').fontSize(8).fillColor(colors.textMuted)
     .text('Figure 2: The Manage Data layout. Displays tab switching, live cell updates, sorting columns, search boxes, and adding rows.', 40, 580, { width: 515, align: 'center' });
} else {
  doc.rect(40, 330, 515, 200).fill(colors.cardBgGrey);
  doc.font('Helvetica').fontSize(10).fillColor(colors.textMuted).text('[Data Manager Screenshot Image Not Found]', 40, 420, { width: 515, align: 'center' });
}

// Resilience section
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentRose).text('AUTO-CACHE RESILIENCE & OFFLINE ROBUSTNESS', 40, 615);
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark).text(
  'AuraRetail does not crash if the Google Sheets API limits are exceeded or if the shop\'s Wi-Fi drops out. The system instantly detects the offline state, shifts reading and writing to lib/mock_db.json, and fires a visual banner informing the admin that the application is running safely on its local offline cache.',
  40, 630, { width: 515, align: 'justify', lineGap: 3.5 }
);


// ----------------------------------------------------
// PAGE 5: VOICE ASSISTANT PIPELINE & INTEGRATION MODELS
// ----------------------------------------------------
doc.addPage();

// Heading
doc.font('Helvetica-Bold').fontSize(16).fillColor(colors.textDark).text('4. Voice Assistant Pipeline & Integration Models', 40, 70);
doc.moveTo(40, 90).lineTo(555, 90).strokeColor(colors.borderLight).lineWidth(1).stroke();

// Speech pipeline description
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentBlue).text('NATURAL SPEECH CONTEXT PIPELINE', 40, 110);
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark).text(
  'The Voice Assistant widget provides hands-free operation. This is especially useful during busy store hours when shopkeepers have their hands full handling physical products. The audio workflow follows a strict, safe execution path:',
  40, 125, { width: 515, lineGap: 3.5 }
);

// Voice workflow steps
const drawVoiceWorkflowStep = (num, stepName, stepDesc, y) => {
  doc.circle(48, y + 5, 3.5).fill(colors.accentGreen);
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(colors.textDark).text(num + '. ' + stepName, 60, y);
  const textW = doc.widthOfString(num + '. ' + stepName);
  doc.font('Helvetica').fontSize(9).fillColor(colors.textDark).text(' - ' + stepDesc, 65 + textW, y, { width: 515 - (30 + textW), lineGap: 2 });
};

drawVoiceWorkflowStep('1', 'Speech Capture', 'Takes speech input from browser microphone using SpeechRecognition (Webkit Speech API) configured for en-IN accent mapping.', 165);
drawVoiceWorkflowStep('2', 'User Validation Check', 'Transcribes and prints words on screen. Shopkeepers can inspect and edit the text first, clicking "Confirm & Send" to proceed.', 195);
drawVoiceWorkflowStep('3', 'n8n Workflow Gateway', 'Sends text to n8n webhook proxy API. n8n acts as the AI router (linking LLMs like GPT or Claude) to parse data values.', 225);
drawVoiceWorkflowStep('4', 'Server-Side TTS Synthesis', 'If n8n returns text, our backend proxies it via Google Translate TTS to render a binary audio stream, speaking the values back.', 255);

// The Models Used
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentBlue).text('SPEECH & AUTOMATION MODELS INTEGRATION', 40, 295);
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark).text(
  '• Speech-to-Text Model: Webkit Speech Recognition Engine (browser-native, lightweight, optimized for en-IN dialects).\n' +
  '• Text-to-Speech Model: Google Translate Text-To-Speech API (converts textual n8n returns under 200 characters into synthetic MP3 bytes).\n' +
  '• AI Agent workflow: Custom n8n workflow webhook proxy (for advanced cognitive routing, AI calculations, and sheet edits).',
  40, 310, { width: 515, lineGap: 3.5 }
);

// Local voice command backup table
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentGreen).text('FAIL-SAFE LOCAL OFFLINE VOICE SHORTCUTS', 40, 380);
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark).text(
  'If n8n is unconfigured or the server loses internet connectivity, the Voice Assistant falls back to local string matching to answer questions directly:',
  40, 395, { width: 515, lineGap: 3.5 }
);

// Table Header
const drawTableHeader = (y) => {
  doc.rect(40, y, 515, 18).fill(colors.primaryBg);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(colors.textLight).text('Voice Commands', 50, y + 5);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(colors.textLight).text('Feature Focus', 230, y + 5);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(colors.textLight).text('Local Action Response', 350, y + 5);
};

const drawTableRow = (phrase, category, response, y, isAlt) => {
  if (isAlt) doc.rect(40, y, 515, 20).fill(colors.cardBgGrey);
  doc.rect(40, y, 515, 20).strokeColor(colors.borderLight).lineWidth(0.5).stroke();
  
  doc.font('Helvetica-Bold').fontSize(8).fillColor(colors.textDark).text(phrase, 46, y + 6, { width: 170 });
  doc.font('Helvetica').fontSize(8).fillColor(colors.textMuted).text(category, 230, y + 6, { width: 110 });
  doc.font('Helvetica').fontSize(8).fillColor(colors.textDark).text(response, 350, y + 6, { width: 200 });
};

drawTableHeader(425);
drawTableRow('"profit today", "net profit"', 'Finance KPIs', 'Speaks current profit margins (computed in context state).', 443, false);
drawTableRow('"revenue today", "gross income"', 'Finance KPIs', 'Speaks current sales revenue total.', 463, true);
drawTableRow('"stock value", "valuation"', 'Inventory valuation', 'Speaks the calculated total cost valuation of active stock.', 483, false);
drawTableRow('"low stock", "shortage alerts"', 'Safety threshold', 'Speaks count of items running below safe threshold levels.', 503, true);
drawTableRow('"go to database", "open ledger"', 'Dashboard Navigation', 'Navigates active page route to the Database Manager.', 523, false);
drawTableRow('"sync spreadsheet", "sync"', 'Manual Data Sync', 'Triggers background cell sync from Google Sheets API.', 543, true);


// ----------------------------------------------------
// PAGE 6: TECHNICAL IMPLEMENTATION & THE JUDGES PITCH
// ----------------------------------------------------
doc.addPage();

// Heading
doc.font('Helvetica-Bold').fontSize(16).fillColor(colors.textDark).text('5. Technical Setup & Judges Project Pitch', 40, 70);
doc.moveTo(40, 90).lineTo(555, 90).strokeColor(colors.borderLight).lineWidth(1).stroke();

// Technology Summary
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentBlue).text('PRODUCTION TECH STACK & SPECIFICATIONS', 40, 110);
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark).text(
  '• Next.js App Router: Provides fast server-rendered API endpoints and responsive client components.\n' +
  '• Recharts: Renders beautiful area/bar charts with smooth transitions.\n' +
  '• Google Sheets API (v4): Accesses spreadsheet cells using JWT keys and OAuth client protocols.\n' +
  '• n8n Webhook: Serves as the cognitive gateway, forwarding transcripts to generative AI workflows.',
  40, 125, { width: 515, lineGap: 3.5 }
);

// Code Box block for environment configuration
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentBlue).text('ENVIRONMENT VARIABLES (.env.local)', 40, 200);
const drawCodeBlock = (codeLines, y) => {
  const height = codeLines.length * 12 + 16;
  doc.rect(40, y, 515, height).fill(colors.primaryBg);
  doc.font('Courier').fontSize(8).fillColor(colors.accentGreen);
  codeLines.forEach((line, idx) => {
    doc.text(line, 55, y + 8 + (idx * 12));
  });
};

drawCodeBlock([
  'GOOGLE_SERVICE_ACCOUNT_EMAIL=auraretail@ai-business-assistant-13998.iam.gserviceaccount.com',
  'GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFA...\\n-----END PRIVATE KEY-----\\n"',
  'GOOGLE_SPREADSHEET_ID=https://docs.google.com/spreadsheets/d/10Y0O8pUfVOVM3RVpCT.../edit',
  'N8N_WEBHOOK_URL=https://hemanthmallela.app.n8n.cloud/webhook/f49f9beb-a9d2-4c01-8fc5...',
  'USE_MOCK_DATA=false',
  'ADMIN_USERNAME=admin',
  'ADMIN_PASSWORD=admin123'
], 215);

// The Judges Pitch
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentGreen).text('WHY OUR PROJECT DESERVES THE HIGHEST RATING', 40, 335);
doc.font('Helvetica').fontSize(9.5).fillColor(colors.textDark).text(
  '1. Practical Social Impact: Small shops represent the backbone of retail economies. AuraRetail gives them enterprise-grade analytics tools with zero hardware costs, simply using a Google Sheet.\n\n' +
  '2. Advanced Voice AI Integration: We go beyond standard text inputs. Shopkeepers use voice commands to check profits or update sheets, while our server-side speech synthesis answers them verbally, making tech accessible to non-technical users.\n\n' +
  '3. Bulletproof Fail-safe Design: We do not fail. If API limits are exceeded or the network is cut, the application automatically shifts to a local mock DB JSON backup. Store data is saved locally and synced when online.\n\n' +
  '4. Complete UX Polish: The user experience is state of the art, utilizing dark modes, visual charts, safety locks, and immediate banners to handle errors gracefully.',
  40, 350, { width: 515, align: 'justify', lineGap: 3.5 }
);

// Conclusion / Thanks
doc.rect(40, 545, 515, 60).fill(colors.lightBlue);
doc.rect(40, 545, 515, 60).strokeColor(colors.borderBlue).lineWidth(1).stroke();
doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.accentBlue)
   .text('CONCLUSION', 55, 558);
doc.font('Helvetica-Oblique').fontSize(9).fillColor(colors.textDark)
   .text('AuraRetail successfully merges cloud databases, analytics dashboards, and interactive speech APIs into an offline-first retail operations tool. Ready for presentation.', 55, 574, { width: 485 });


// ----------------------------------------------------
// GLOBAL RENDER: DRAW FOOTERS AND HEADERS (PAGE NUMBERS)
// ----------------------------------------------------
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  
  if (i > 0) { // Skip Cover Page
    // Draw Running Header
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(colors.textMuted);
    doc.text('AURARETAIL — HACKATHON PRESENTATION GUIDE', 40, 30);
    doc.text('PROJECT OVERVIEW & EVALUATION', 40, 30, { align: 'right', width: 515 });
    doc.moveTo(40, 42).lineTo(555, 42).strokeColor(colors.borderLight).lineWidth(0.5).stroke();
    
    // Draw Running Footer
    doc.moveTo(40, 798).lineTo(555, 798).strokeColor(colors.borderLight).lineWidth(0.5).stroke();
    doc.font('Helvetica').fontSize(7.5).fillColor(colors.textMuted);
    doc.text('AuraRetail Control Layer • Live Google Sheets & Voice AI integration', 40, 805);
    doc.text(`Page ${i + 1} of ${range.count}`, 40, 805, { align: 'right', width: 515 });
  }
}

// 2. Finalize PDF Writing
doc.end();

stream.on('finish', () => {
  console.log('Successfully generated Smart_Store_User_Guide.pdf containing ' + range.count + ' pages.');
});
