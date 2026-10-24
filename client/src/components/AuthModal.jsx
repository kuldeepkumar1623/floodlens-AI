import React, { useState } from 'react';

function AuthModal({ isOpen, onClose, onLoginSuccess, initialRole = 'resident' }) {
  // Tabs: 'resident' (Resident Citizen) or 'admin' (Authority Administrator)
  const [activeRole, setActiveRole] = useState(initialRole);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    setError(null);
    setIsRegister(false);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { name, email, password, role: activeRole } 
      : { email, password, role: activeRole };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Check if user logging into admin tab actually has admin role
      if (activeRole === 'admin' && data.user.role !== 'admin') {
        throw new Error('Access Denied: This account does not possess Administrative Clearance.');
      }

      localStorage.setItem('floodlens_token', data.token);
      localStorage.setItem('floodlens_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isAdminTab = activeRole === 'admin';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
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
        maxWidth: '440px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        {/* Header with Role Tabs */}
        <div style={{ background: '#0f172a', padding: '16px 20px 0 20px', color: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: isAdminTab ? '#10b981' : '#38bdf8', fontWeight: 700 }}>
              {isAdminTab ? '🛡️ Authority Administrator Portal' : '👤 Resident Citizen Portal'}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          {/* Role Switcher Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleRoleSwitch('resident')}
              style={{
                flex: 1,
                padding: '10px 8px',
                border: 'none',
                borderBottom: !isAdminTab ? '3px solid #38bdf8' : '3px solid transparent',
                background: !isAdminTab ? '#1e293b' : 'transparent',
                color: !isAdminTab ? '#38bdf8' : '#94a3b8',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.85rem',
                borderRadius: '6px 6px 0 0'
              }}
            >
              👤 Resident Citizen
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              style={{
                flex: 1,
                padding: '10px 8px',
                border: 'none',
                borderBottom: isAdminTab ? '3px solid #10b981' : '3px solid transparent',
                background: isAdminTab ? '#1e293b' : 'transparent',
                color: isAdminTab ? '#10b981' : '#94a3b8',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.85rem',
                borderRadius: '6px 6px 0 0'
              }}
            >
              🛡️ Disaster Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            background: isAdminTab ? '#ecfdf5' : '#f0f9ff',
            border: `1px solid ${isAdminTab ? '#a7f3d0' : '#bae6fd'}`,
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: isAdminTab ? '#065f46' : '#0369a1'
          }}>
            {isAdminTab ? (
              <>
                <strong>Administrative Access Notice:</strong> Authorized for State/District Disaster Management Authorities (SDMA/DDMA) & NDRF responders only.
              </>
            ) : (
              <>
                <strong>Resident Access:</strong> Track personal locality rainfall telemetry, explore history, view AI risk assessments, and submit emergency SOS.
              </>
            )}
          </div>

          {isRegister && !isAdminTab && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Dr. Aarti Deshmukh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              {isAdminTab ? 'Official Gov/Authority Email' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              placeholder={isAdminTab ? 'Authorized administrator email' : 'you@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <div style={{ color: '#dc2626', fontSize: '0.82rem', background: '#fee2e2', padding: '8px', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px',
              background: isAdminTab ? '#059669' : '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Authenticating...' : (isRegister ? 'Register as Resident' : `Sign In as ${isAdminTab ? 'Administrator' : 'Resident'}`)}
          </button>

          {!isAdminTab && (
            <div style={{ textAlign: 'center', fontSize: '0.82rem' }}>
              <span style={{ color: '#64748b' }}>
                {isRegister ? 'Already registered? ' : 'New resident citizen? '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {isRegister ? 'Sign In Here' : 'Create Resident Account'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
