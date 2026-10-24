import React, { useState } from 'react';

function EmergencyModal({ isOpen, onClose, defaultLocation }) {
  const [location, setLocation] = useState(defaultLocation || '');
  const [category, setCategory] = useState('Severe Waterlogging / Trapped');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sosResult, setSosResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      location,
      category,
      contactName,
      contactPhone,
      message
    };

    try {
      const response = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }
      setSosResult(data);
    } catch (err) {
      // Offline fallback: save to local storage
      const queuedRequests = JSON.parse(localStorage.getItem('queued_sos') || '[]');
      const offlineRecord = {
        ...payload,
        id: `OFFLINE-SOS-${Date.now()}`,
        status: 'Saved locally in IndexedDB / LocalStorage queue',
        timestamp: new Date().toISOString()
      };
      queuedRequests.unshift(offlineRecord);
      localStorage.setItem('queued_sos', JSON.stringify(queuedRequests));

      setSosResult({
        message: 'Network offline. SOS saved locally on device and will transmit upon reconnect. Please call 112 directly if urgent.',
        request: offlineRecord,
        isOffline: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#dc2626',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🆘 Emergency Flood SOS Center
            </h2>
            <p style={{ margin: 0, fontSize: '0.78rem', opacity: 0.9 }}>
              Official Dispatch Link to District Disaster Operations Center
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {sosResult ? (
            <div>
              <div style={{
                background: sosResult.isOffline ? '#fef3c7' : '#ecfdf5',
                border: `1px solid ${sosResult.isOffline ? '#f59e0b' : '#10b981'}`,
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: sosResult.isOffline ? '#b45309' : '#047857' }}>
                  {sosResult.isOffline ? '⚠️ Stored Offline on Device' : '✅ Emergency Request Transmitted'}
                </h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem' }}>{sosResult.message}</p>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <strong>Request ID:</strong> {sosResult.request?.id}
                  <br />
                  <strong>Current Status:</strong> {sosResult.request?.status}
                </div>
              </div>

              <div style={{
                background: '#f1f5f9',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                color: '#334155',
                marginBottom: '16px'
              }}>
                <strong>Direct Emergency Call Hotlines (India):</strong>
                <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                  <li>National Emergency Support: <strong>112</strong></li>
                  <li>NDRF Disaster Control Helpline: <strong>1078</strong></li>
                  <li>State Disaster Management Authority: <strong>1070</strong></li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSosResult(null);
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close Emergency Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Specific Location / Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward 4, Kurla West near station road"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Emergency Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="Severe Waterlogging / Trapped">Severe Inundation / Citizens Trapped</option>
                  <option value="Medical Emergency during Flood">Medical Assistance / Senior Citizen in Danger</option>
                  <option value="Structural Collapse / Dam Risk">Wall / Embankment Breach Alert</option>
                  <option value="Food & Drinking Water Shortage">Drinking Water / Rations Depleted</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Situation Details & Evacuation Urgency
                </label>
                <textarea
                  rows="3"
                  placeholder="Water level depth, number of trapped individuals, electricity status..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              {error && (
                <div style={{ color: '#dc2626', fontSize: '0.82rem' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px',
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Transmitting to Dispatch Center...' : '🚨 Transmit Immediate SOS'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmergencyModal;

