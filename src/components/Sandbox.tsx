import React, { useState } from 'react';
import { FileCode, Trash2, X, Terminal, Check, Copy } from 'lucide-react';

export interface ApiLog {
  id: string;
  timestamp: string;
  api: 'AirService' | 'LodgingService' | 'ConciergeRegistry';
  endpoint: string;
  request: any;
  response: any;
}

interface SandboxProps {
  logs: ApiLog[];
  onClearLogs: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sandbox: React.FC<SandboxProps> = ({ logs, onClearLogs, isOpen, onClose }) => {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'AirService' | 'LodgingService' | 'ConciergeRegistry'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => {
    if (activeTab === 'all') return true;
    return log.api === activeTab;
  });

  const selectedLog = logs.find(log => log.id === selectedLogId);

  // Generate mock cURL requests for learning purposes
  const getCurlCode = (log: ApiLog) => {
    let url = '';
    let headers = '';
    let body = '';

    // Clean up endpoint path to remove any raw GDS provider prefixes for complete white-labeling
    let cleanPath = log.endpoint.replace(/^[A-Z]+\s/, '').replace(/\s*\(FAILED\)\s*/i, '');
    
    // Remove redundant GDS/API prefixes to make the white-labeled API look clean
    cleanPath = cleanPath.replace(/^\/(air|places|stays|cars)/, '');

    if (log.api === 'AirService') {
      if (log.endpoint.includes('cars')) {
        url = `https://api.luxurymytravel.com/v1/chauffeur${cleanPath}`;
        headers = `-H "Authorization: Bearer luxe_cars_live_..."`;
      } else {
        url = `https://api.luxurymytravel.com/v1/flights${cleanPath}`;
        headers = `-H "Authorization: Bearer luxe_air_live_..." \\\n  -H "Luxe-Air-Version: v1"`;
      }
    } else if (log.api === 'LodgingService') {
      url = `https://api.luxurymytravel.com/v1/stays${cleanPath}`;
      headers = `-H "Authorization: Bearer luxe_lodging_token_..."`;
    } else {
      // Remove query parameters from path if they exist since we append them cleanly
      const pathOnly = cleanPath.split('?')[0];
      url = `https://api.luxurymytravel.com/v1/concierge${pathOnly}`;
      headers = `-H "Accept: application/json"`;
    }

    // Append query params if GET request with a query payload
    if (log.endpoint.startsWith('GET') && log.request && Object.keys(log.request).length > 0) {
      const params = new URLSearchParams();
      Object.entries(log.request).forEach(([key, val]) => {
        if (val !== undefined && val !== null && key !== 'validation_check' && key !== 'itemId') {
          params.append(key, String(val));
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    if (log.endpoint.startsWith('POST')) {
      body = ` \\\n  -d '${JSON.stringify(log.request, null, 2)}'`;
      return `curl -X POST "${url}" \\\n  ${headers}${body}`;
    }
    
    return `curl -X GET "${url}" \\\n  ${headers}`;
  };

  const handleCopyCode = (logId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(logId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '550px',
      maxWidth: '100%',
      height: '100vh',
      background: 'rgba(6, 6, 8, 0.95)',
      backdropFilter: 'blur(20px)',
      borderLeft: '1px solid var(--color-border)',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.8)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#09090b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={18} style={{ color: 'var(--color-gold)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 500 }}>API Sandbox Inspector</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={onClearLogs}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.8rem'
            }}
            title="Clear logs"
            className="sandbox-header-btn"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
            className="sandbox-header-btn"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border)',
        background: '#07070a',
        padding: '0 1rem'
      }}>
        {(['all', 'AirService', 'LodgingService', 'ConciergeRegistry'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === tab ? 'var(--color-gold)' : 'var(--color-text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 500,
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid var(--color-gold)' : '2px solid transparent',
              transition: 'var(--transition-smooth)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {tab === 'all' ? 'All Logs' : tab === 'AirService' ? 'Private Aviation' : tab === 'LodgingService' ? 'Exclusive Stays' : 'Dining & Excursions'}
          </button>
        ))}
      </div>

      {/* Main Body (Split view of logs list and payload inspector) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Logs List */}
        <div style={{
          flex: '1 1 45%',
          overflowY: 'auto',
          borderBottom: '1px solid var(--color-border)',
          padding: '0.5rem 0'
        }}>
          {filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              No API interactions logged yet. <br />
              <span style={{ fontSize: '0.75rem' }}>Try searching, inspecting, or reserving items to see the data flow!</span>
            </div>
          ) : (
            filteredLogs.map(log => {
              const isSelected = log.id === selectedLogId;
              const isPost = log.endpoint.startsWith('POST');
              
              return (
                <div 
                  key={log.id}
                  onClick={() => setSelectedLogId(log.id)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(223, 195, 132, 0.04)' : 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    borderLeft: isSelected ? '3px solid var(--color-gold)' : '3px solid transparent',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="log-item"
                >
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: log.endpoint.includes('cars') ? '#fbbf24' : log.api === 'AirService' ? '#60a5fa' : log.api === 'LodgingService' ? '#34d399' : '#f472b6',
                        background: 'rgba(255,255,255,0.02)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '2px',
                        border: `1px solid rgba(${log.endpoint.includes('cars') ? '251,191,36' : log.api === 'AirService' ? '96,165,250' : log.api === 'LodgingService' ? '52,211,153' : '244,114,182'}, 0.2)`
                      }}>
                        {log.endpoint.includes('cars') ? 'Chauffeur' : log.api === 'AirService' ? 'Aviation' : log.api === 'LodgingService' ? 'Stays' : 'Dining/Exp'}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        fontFamily: 'monospace',
                        color: isPost ? 'var(--color-gold)' : 'var(--color-text-primary)'
                      }}>
                        {log.endpoint}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{log.timestamp}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Payload Inspector Detail */}
        <div style={{
          flex: '1 1 55%',
          display: 'flex',
          flexDirection: 'column',
          background: '#030304',
          overflow: 'hidden'
        }}>
          {selectedLog ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              {/* Tab headers */}
              <div style={{
                padding: '0.75rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                background: '#050507',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Payload Inspector
                </span>

                <button
                  onClick={() => handleCopyCode(selectedLog.id, getCurlCode(selectedLog))}
                  style={{
                    background: 'none',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-gold-light)',
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  className="copy-btn"
                >
                  {copiedId === selectedLog.id ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedId === selectedLog.id ? 'Copied cURL' : 'Copy cURL'}</span>
                </button>
              </div>

              {/* Payload content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Simulated cURL */}
                <div>
                  <h5 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                    Simulated HTTP Request
                  </h5>
                  <pre style={{
                    background: '#09090c',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    color: '#c4b5fd',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto'
                  }}>
                    {getCurlCode(selectedLog)}
                  </pre>
                </div>

                {/* Request Payload JSON */}
                <div>
                  <h5 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
                    JSON Request Parameters
                  </h5>
                  <pre style={{
                    background: '#09090c',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    color: '#e2e8f0',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflowX: 'auto'
                  }}>
                    {JSON.stringify(selectedLog.request, null, 2)}
                  </pre>
                </div>

                {/* Response Payload JSON */}
                <div>
                  <h5 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-success)', marginBottom: '0.5rem', fontWeight: 600 }}>
                    JSON Response Payload
                  </h5>
                  <pre style={{
                    background: '#09090c',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    color: '#86efac',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflowX: 'auto'
                  }}>
                    {JSON.stringify(selectedLog.response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column',
              gap: '0.75rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.85rem'
            }}>
              <FileCode size={36} />
              <span>Select an API endpoint log to inspect the query payloads</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sandbox-header-btn:hover {
          color: var(--color-gold) !important;
        }
        .log-item:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .copy-btn:hover {
          border-color: var(--color-gold) !important;
          background: rgba(223, 195, 132, 0.05);
        }
      `}</style>
    </div>
  );
};
