import React, { useState } from 'react';
import { Calendar as CalendarIcon, AlertCircle, ExternalLink } from 'lucide-react';
import './Calendar.css';

const CalendarFallback = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="calendar-container">
      <div className="calendar-auth">
        <AlertCircle size={48} className="auth-icon" style={{ color: '#f59e0b' }} />
        <h3>Google Calendar Setup Required</h3>
        <p>Google OAuth requires proper domain configuration for calendar integration.</p>
        
        <div style={{ marginTop: '20px', textAlign: 'left', maxWidth: '500px' }}>
          <h4>📅 Your Calendar Options:</h4>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <strong>Option 1: View in Google Calendar</strong>
            <br />
            <a 
              href="https://calendar.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#6366f1', 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '8px'
              }}
            >
              Open Google Calendar <ExternalLink size={16} />
            </a>
          </div>
          
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '8px' }}>
            <strong>Option 2: Deploy Dashboard</strong>
            <br />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Deploy to Netlify/Vercel with proper OAuth setup for full integration
            </span>
            <button 
              onClick={() => setShowInstructions(!showInstructions)}
              style={{
                background: 'none',
                border: '1px solid #10b981',
                color: '#10b981',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                marginTop: '8px',
                display: 'block'
              }}
            >
              {showInstructions ? 'Hide' : 'Show'} Setup Instructions
            </button>
          </div>
        </div>

        {showInstructions && (
          <div style={{ 
            marginTop: '16px', 
            padding: '16px', 
            background: 'rgba(243, 244, 246, 0.8)', 
            borderRadius: '8px',
            textAlign: 'left',
            fontSize: '14px'
          }}>
            <h4>🚀 To Enable Google Calendar:</h4>
            <ol style={{ paddingLeft: '20px' }}>
              <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
              <li>Add your deployed domain to "Authorized JavaScript origins"</li>
              <li>Add redirect URI: <code>https://yourdomain.com</code></li>
              <li>Deploy dashboard to Netlify, Vercel, or similar</li>
              <li>Calendar integration will work on live domain</li>
            </ol>
            <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '12px' }}>
              <strong>Note:</strong> Google OAuth security restrictions prevent localhost calendar access
            </p>
          </div>
        )}

        {/* Mock Calendar View */}
        <div style={{ marginTop: '24px' }}>
          <h4>📅 Calendar Preview (Mock Data)</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '1px',
            background: '#e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            marginTop: '12px'
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ 
                background: '#f9fafb', 
                padding: '8px', 
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280'
              }}>
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} style={{ 
                background: 'white', 
                minHeight: '40px', 
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}>
                <span style={{ fontSize: '12px', color: '#374151' }}>
                  {i + 1 <= 31 ? i + 1 : ''}
                </span>
                {(i + 1) % 7 === 3 && i < 28 && (
                  <div style={{ 
                    width: '100%', 
                    height: '2px', 
                    background: '#10b981', 
                    borderRadius: '1px',
                    marginTop: '2px'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarFallback;