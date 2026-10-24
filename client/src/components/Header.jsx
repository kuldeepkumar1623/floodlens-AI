import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', dir: 'ltr' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', dir: 'ltr' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', dir: 'ltr' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', dir: 'ltr' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', dir: 'ltr' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', native: 'اردو', dir: 'rtl' },
];

function Header({ user, onLogout, onOpenAuth, onOpenSOS, activeTab, setActiveTab }) {
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (code, dir) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = dir || 'ltr';
    document.documentElement.lang = code;
    setLangOpen(false);
  };

  const currentLang = INDIAN_LANGUAGES.find((l) => l.code === i18n.language) || INDIAN_LANGUAGES[0];

  return (
    <header style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      background: '#0f172a',
      color: '#ffffff',
      borderRadius: '8px',
      marginBottom: '16px',
      gap: '12px'
    }}>
      {/* Brand & Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '2.2rem' }}>🌊</span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#38bdf8' }}>
              FloodLens
            </h1>
            <span style={{
              fontSize: '0.7rem',
              background: '#0284c7',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 600
            }}>
              National Civic Tech
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
            {t('appSubtitle', 'Flood updates and safety information for your area')}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            background: activeTab === 'overview' ? '#1e293b' : 'transparent',
            color: activeTab === 'overview' ? '#38bdf8' : '#cbd5e1',
            border: activeTab === 'overview' ? '1px solid #38bdf8' : 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          📊 {t('nav.dashboard', 'Dashboard')}
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          style={{
            background: activeTab === 'alerts' ? '#1e293b' : 'transparent',
            color: activeTab === 'alerts' ? '#f59e0b' : '#cbd5e1',
            border: activeTab === 'alerts' ? '1px solid #f59e0b' : 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          🚨 {t('alerts.title', 'Official Alerts')}
        </button>

        {user && user.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            style={{
              background: activeTab === 'admin' ? '#064e3b' : 'transparent',
              color: activeTab === 'admin' ? '#34d399' : '#cbd5e1',
              border: activeTab === 'admin' ? '1px solid #34d399' : 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            🛡️ Admin Dispatch Center
          </button>
        )}
      </nav>

      {/* Controls & Login Options */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Emergency SOS Button */}
        <button
          onClick={onOpenSOS}
          style={{
            background: '#dc2626',
            color: '#ffffff',
            border: 'none',
            padding: '8px 14px',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.88rem',
            boxShadow: '0 0 10px rgba(220, 38, 38, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          🆘 Emergency SOS
        </button>

        {/* 12 Indian Languages Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            style={{
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🌐 {currentLang.native}
          </button>

          {langOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '110%',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              zIndex: 1000,
              width: '180px',
              maxHeight: '260px',
              overflowY: 'auto'
            }}>
              {INDIAN_LANGUAGES.map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code, lang.dir)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    color: i18n.language === lang.code ? '#38bdf8' : '#e2e8f0',
                    background: i18n.language === lang.code ? '#1e293b' : 'transparent',
                    borderBottom: '1px solid #1e293b'
                  }}
                >
                  <strong>{lang.native}</strong> ({lang.name})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Session Management with Separate Admin & Resident Login */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.78rem',
              padding: '3px 8px',
              borderRadius: '4px',
              background: user.role === 'admin' ? '#065f46' : '#0369a1',
              color: '#ffffff',
              fontWeight: 600
            }}>
              {user.role === 'admin' ? '🛡️ Admin' : '👤 Citizen'}: {user.name}
            </span>
            <button
              onClick={onLogout}
              style={{
                background: '#334155',
                color: '#f8fafc',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '6px' }}>
            {/* Separate Resident Login Button */}
            <button
              onClick={() => onOpenAuth('resident')}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              👤 Resident Login
            </button>

            {/* Separate Admin Login Button */}
            <button
              onClick={() => onOpenAuth('admin')}
              style={{
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🛡️ Admin Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
