import React, { useState, useEffect } from 'react';

function AlertsView() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/alerts')
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data.alerts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        background: '#ffffff',
        padding: '18px 20px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>
            🚨 Official Flood Warnings & Advisories
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Synchronized directly with India Meteorological Department (IMD) and Central Water Commission (CWC).
          </p>
        </div>
        <span style={{
          background: '#dcfce7',
          color: '#15803d',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '0.78rem',
          fontWeight: 600
        }}>
          Live Broadcast Active
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Polling statutory warning feeds...
        </div>
      ) : (
        alerts.map((alt) => {
          const isCritical = alt.severity === 'Critical';
          return (
            <div
              key={alt.id}
              style={{
                background: '#ffffff',
                borderLeft: `6px solid ${isCritical ? '#dc2626' : '#f59e0b'}`,
                borderRadius: '0 8px 8px 0',
                padding: '18px 20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                border: '1px solid #cbd5e1',
                borderLeftWidth: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{
                  background: isCritical ? '#fee2e2' : '#fef3c7',
                  color: isCritical ? '#b91c1c' : '#b45309',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}>
                  {alt.severity} Alert
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Issued: {new Date(alt.issuedAt).toLocaleString()}
                </span>
              </div>

              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>
                {alt.title}
              </h3>

              <div style={{ fontSize: '0.86rem', color: '#334155', marginBottom: '10px' }}>
                <strong>Authority:</strong> {alt.authority} | <strong>Coverage Area:</strong> {alt.geographicScope}
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.86rem',
                color: '#1e293b',
                marginBottom: '10px'
              }}>
                <strong>Recommended Public Action:</strong> {alt.recommendedAction}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>Verification: <strong>{alt.verified ? 'Verified Official Issuance' : 'Provisional'}</strong></span>
                <span>Valid Until: {new Date(alt.validUntil).toLocaleString()}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default AlertsView;

