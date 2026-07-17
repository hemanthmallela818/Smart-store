"use client";

import React, { Suspense } from 'react';
import { 
  TrendingUp, 
  IndianRupee, 
  Package, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  XCircle,
  Percent,
  Search,
  Bell,
  ArrowRight,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';

import { 
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

import { useData } from './context';
import Header from './Header';
import VoiceAssistant from './VoiceAssistant';

// Circle Progress component for circular metrics
const CircleProgress = ({ percent, color, label }) => {
  const radius = 20;
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray - (dashArray * percent) / 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={radius} fill="none" stroke="#f0f3f2" strokeWidth="4.5" />
          <circle cx="28" cy="28" r={radius} fill="none" stroke={color} strokeWidth="4.5" 
            strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeLinecap="round"
            transform="rotate(-90 28 28)" />
        </svg>
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginLeft: '-1px' }}>
          {percent}%
        </span>
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>{label}</span>
    </div>
  );
};

function CatalogDashboard() {
  const { 
    data, 
    loading, 
    error, 
    toasts, 
    removeToast 
  } = useData();

  if (loading && data.inventory.length === 0) {
    return (
      <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center', height: '80vh', border: 'none', background: 'transparent' }}>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Initializing Business Intelligence...</p>
        </div>
      </div>
    );
  }

  // Filter out days with no sales for the daily transaction analytics graph
  const filteredRevenueTrend = data.revenueTrend.filter(t => t.revenue > 0);

  // Calculate dynamic circular progress indicators (Traffic Effectives look)
  const totalItems = data.inventory.length || 1;
  const safeItems = data.inventory.filter(i => i.quantity >= 10).length;
  const lowStockItems = data.inventory.filter(i => i.quantity < 10).length;
  const perishableItems = data.inventory.filter(i => i.expiryDate && i.expiryDate !== '—').length;

  const safePercent = Math.round((safeItems / totalItems) * 100);
  const lowPercent = Math.round((lowStockItems / totalItems) * 100);
  const perishablePercent = Math.round((perishableItems / totalItems) * 100);

  // Dynamic Pie Chart Data (Mail Statistic look)
  const freshCount = data.inventory.filter(i => i.expiryDate && i.expiryDate !== '—').length;
  const deviceCount = data.inventory.filter(i => i.name.toLowerCase().includes('phone') || i.name.toLowerCase().includes('laptop') || i.name.toLowerCase().includes('galaxy')).length;
  const otherCount = Math.max(0, data.inventory.length - freshCount - deviceCount);

  const categoryPieData = [
    { name: 'Perishable', value: freshCount || 3, color: '#085b5f' },
    { name: 'Electronics', value: deviceCount || 3, color: '#eab308' },
    { name: 'General', value: otherCount || 4, color: '#f97316' }
  ];

  return (
    <div className="dashboard-container">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === 'success' ? (
              <CheckCircle size={18} color="var(--emerald)" />
            ) : (
              <XCircle size={18} color="var(--rose)" />
            )}
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>&times;</button>
          </div>
        ))}
      </div>

      {/* Catalog Left Sidebar */}
      <Header />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Profile Header Bar */}
        <header className="content-header" style={{ marginBottom: '1.25rem' }}>
          <div className="content-header-left">
            <span className="welcome-text">Business Performance Overview</span>
            <h1 className="page-title">Dashboard</h1>
          </div>
          <div className="content-header-right">
            <div className="header-icons">
              <button className="header-icon-btn" aria-label="Notifications" style={{ position: 'relative' }}>
                <Bell size={16} />
                {(lowStockItems > 0) && (
                  <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, background: 'var(--rose)', borderRadius: '50%' }}></span>
                )}
              </button>
            </div>
            <div className="profile-avatar">
              <div className="avatar-img">F</div>
              <span className="avatar-name">Floyd Miles</span>
            </div>
          </div>
        </header>

        {/* Offline Banner Indicator */}
        {error && (
          <div className="alert-banner">
            <div className="alert-content">
              <AlertTriangle size={16} />
              <span><strong>Sheets Connection offline:</strong> {error}. Reverting to local store database cache.</span>
            </div>
          </div>
        )}

        {/* Top Grid Row: Voice Agent & Transaction Analytics Side-by-Side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Left Column: Voice Assistant */}
          <VoiceAssistant />

          {/* Right Column: Daily Transaction Analytics Bar Chart */}
          <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daily Transaction Analytics</h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Daily store sales ledger overview</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                <Clock size={12} /> Live tracking
              </span>
            </div>
            <div style={{ width: '100%', height: '180px' }}>
              {filteredRevenueTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredRevenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 28, 30, 0.06)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--text-secondary)" 
                      fontSize={9} 
                      tickLine={false}
                      fontWeight={600}
                    />
                    <YAxis 
                      stroke="var(--text-secondary)" 
                      fontSize={9} 
                      tickLine={false}
                      fontWeight={600}
                      tickFormatter={(val) => `₹${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderColor: 'var(--border-color)', 
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-family)',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                      }}
                      formatter={(val) => [`₹${val.toFixed(0)}`, 'Revenue']}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="var(--teal-accent)" 
                      radius={[4, 4, 0, 0]} 
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">No transactional data available for bar metrics.</div>
              )}
            </div>
          </div>
        </div>

        {/* 3. DETAILS GRID: Left Column (3 Wavy KPI Cards), Right Column (Pie Chart + Dials and Table below graph) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem' }}>
          
          {/* KPI Sparkline Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Card 1: Today's Revenue */}
            <div className="wave-kpi-card">
              <div className="wave-kpi-left">
                <div className="wave-kpi-platform-row">
                  <div className="wave-kpi-icon-circle" style={{ backgroundColor: 'var(--teal-accent)' }}>
                    <TrendingUp size={12} />
                  </div>
                  <div className="wave-kpi-label-wrapper">
                    <span className="wave-kpi-label">Today's Revenue</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      Sales Ledger <span className="wave-kpi-status-dot"></span>
                    </span>
                  </div>
                </div>
                <span className="wave-kpi-value">₹{data.kpis.todaysRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="wave-kpi-right">
                <svg viewBox="0 0 120 40" style={{ width: '100%', height: '100%' }}>
                  <path d="M 0 25 Q 15 5, 30 25 T 60 25 T 90 10 T 120 20" fill="none" stroke="var(--teal-accent)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Card 2: Today's Profit */}
            <div className="wave-kpi-card">
              <div className="wave-kpi-left">
                <div className="wave-kpi-platform-row">
                  <div className="wave-kpi-icon-circle" style={{ backgroundColor: '#22c55e' }}>
                    <IndianRupee size={12} />
                  </div>
                  <div className="wave-kpi-label-wrapper">
                    <span className="wave-kpi-label">Today's Profit</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      Net Margin <span className="wave-kpi-status-dot"></span>
                    </span>
                  </div>
                </div>
                <span className="wave-kpi-value" style={{ color: 'var(--teal-accent)' }}>₹{data.kpis.todaysProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="wave-kpi-right">
                <svg viewBox="0 0 120 40" style={{ width: '100%', height: '100%' }}>
                  <path d="M 0 15 Q 20 30, 40 10 T 80 25 T 120 12" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Card 3: Total Stock Value */}
            <div className="wave-kpi-card">
              <div className="wave-kpi-left">
                <div className="wave-kpi-platform-row">
                  <div className="wave-kpi-icon-circle" style={{ backgroundColor: '#eab308' }}>
                    <Package size={12} />
                  </div>
                  <div className="wave-kpi-label-wrapper">
                    <span className="wave-kpi-label">Stock Valuation</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      Inventory cost <span className="wave-kpi-status-dot"></span>
                    </span>
                  </div>
                </div>
                <span className="wave-kpi-value">₹{data.kpis.totalStockValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="wave-kpi-right">
                <svg viewBox="0 0 120 40" style={{ width: '100%', height: '100%' }}>
                  <path d="M 0 30 Q 15 15, 30 30 T 60 10 T 90 25 T 120 10" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

          </div>

          {/* Right column bottom components */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Categories & circular stock progress elements (MOVED BELOW GRAPH) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
              
              {/* Product Breakdown Pie Chart */}
              <div className="clean-card circle-metric-card">
                <div className="circle-metric-header">
                  <h2>Product Breakdown</h2>
                </div>
                <div className="circle-metric-body">
                  <div style={{ width: '90px', height: '90px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryPieData}
                          innerRadius={28}
                          outerRadius={40}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="traffic-indicators">
                    {categoryPieData.map(c => (
                      <div key={c.name} className="traffic-indicator-row">
                        <span className="traffic-dot" style={{ backgroundColor: c.color }}></span>
                        <span style={{ fontSize: '0.78rem' }}>{c.name}</span>
                        <span className="traffic-percent">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Traffic Effectives style Circular Stock Gauges */}
              <div className="clean-card circle-metric-card">
                <div className="circle-metric-header">
                  <h2>Inventory Health Status</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0.25rem 0' }}>
                  <CircleProgress percent={safePercent} color="var(--emerald)" label="Safe Stock" />
                  <CircleProgress percent={lowPercent} color="var(--amber)" label="Low Stock" />
                  <CircleProgress percent={perishablePercent} color="var(--orange)" label="Perishable" />
                </div>
              </div>

            </div>

            {/* Best Sellers schedule table */}
            <div className="schedule-table-card">
              <div className="schedule-header">
                <h2>Best-Selling Products schedule</h2>
                <a href="/data" style={{ fontSize: '0.85rem', color: 'var(--teal-accent)', fontWeight: 600, textDecoration: 'none' }}>
                  Manage Stock <ArrowRight size={12} style={{ display: 'inline-block', marginLeft: '0.15rem', verticalAlign: 'middle' }} />
                </a>
              </div>
              {data.bestSellers.length > 0 ? (
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th className="schedule-header-cell" style={{ width: '40px' }}>No</th>
                      <th className="schedule-header-cell">Item Name</th>
                      <th className="schedule-header-cell" style={{ textAlign: 'right', width: '80px' }}>Sales qty</th>
                      <th className="schedule-header-cell" style={{ textAlign: 'right' }}>Gross Revenue</th>
                      <th className="schedule-header-cell" style={{ textAlign: 'right' }}>Net profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bestSellers.slice(0, 4).map((item, idx) => (
                      <tr key={item.name} className="schedule-row">
                        <td className="schedule-cell schedule-cell-bold">0{idx + 1}</td>
                        <td className="schedule-cell schedule-cell-bold" style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                        <td className="schedule-cell" style={{ textAlign: 'right', fontWeight: 600 }}>{item.quantity}</td>
                        <td className="schedule-cell" style={{ textAlign: 'right', color: 'var(--text-primary)', fontWeight: 700 }}>₹{item.revenue.toFixed(0)}</td>
                        <td className="schedule-cell" style={{ textAlign: 'right', color: 'var(--emerald)', fontWeight: 700 }}>+₹{item.profit.toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">No sales transactions compiled.</div>
              )}
            </div>

          </div>

        </div>

        {/* Footer */}
        <footer style={{ marginTop: 'auto', paddingTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <p>Smart Catalog Store Intelligence &bull; Live Google Sheets Integration</p>
        </footer>
      </main>
    </div>
  );
}

export default function CatalogDashboardPage() {
  return (
    <Suspense fallback={
      <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center', height: '80vh', border: 'none', background: 'transparent' }}>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading Dashboard...</p>
        </div>
      </div>
    }>
      <CatalogDashboard />
    </Suspense>
  );
}
