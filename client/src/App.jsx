import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import SummaryCards from './components/SummaryCards';
import RainfallChart from './components/RainfallChart';
import FloodMap from './components/FloodMap';
import RiskAssessmentCard from './components/RiskAssessmentCard';
import RainImpactTimeline from './components/RainImpactTimeline';
import LocalityComparison from './components/LocalityComparison';
import DataQualityPanel from './components/DataQualityPanel';
import BlindSpotDetector from './components/BlindSpotDetector';
import DataSourcesPanel from './components/DataSourcesPanel';
import Disclaimer from './components/Disclaimer';
import EmergencyModal from './components/EmergencyModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import AlertsView from './components/AlertsView';
import AIAssistant from './components/AIAssistant';
import {
  fetchLocations,
  fetchRainfall,
  fetchFloodHistory,
  fetchDataQuality,
  fetchSummary,
  fetchCompare
} from './api';

const DEFAULT_START = '2023-06-01';
const DEFAULT_END = '2024-09-30';

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Kurla');
  const [startDate, setStartDate] = useState(DEFAULT_START);
  const [endDate, setEndDate] = useState(DEFAULT_END);

  const [rainfallData, setRainfallData] = useState([]);
  const [floodData, setFloodData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [quality, setQuality] = useState(null);
  const [compareData, setCompareData] = useState(null);

  // Tab navigation: 'overview' (clean main), 'analytics' (deep charts), 'compare' (comparison), 'alerts', 'admin'
  const [activeTab, setActiveTab] = useState('overview');
  const [showAdvancedAudit, setShowAdvancedAudit] = useState(false);

  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRoleMode, setAuthRoleMode] = useState('resident');
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('floodlens_user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchLocations()
      .then((res) => {
        setLocations(res.locations || []);
      })
      .catch(() => setError('Failed to connect to meteorological backend'));
  }, []);

  useEffect(() => {
    if (!selectedLocation) return;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchRainfall(selectedLocation, startDate, endDate),
      fetchFloodHistory(selectedLocation, startDate, endDate),
      fetchSummary(selectedLocation, startDate, endDate),
      fetchDataQuality(selectedLocation),
    ])
      .then(([rainRes, floodRes, summaryRes, qualityRes]) => {
        setRainfallData(rainRes.data || []);
        setFloodData(floodRes.data || []);
        setSummary(summaryRes);
        setQuality(qualityRes);
        setLoading(false);
      })
      .catch(() => {
        setError('Error synchronizing telemetry');
        setLoading(false);
      });
  }, [selectedLocation, startDate, endDate]);

  const handleCompare = (locArray) => {
    if (locArray.length < 2) return;
    setLoading(true);
    fetchCompare(locArray, startDate, endDate)
      .then((res) => {
        setCompareData(res);
        setLoading(false);
      })
      .catch(() => {
        setError('Comparison calculation failed');
        setLoading(false);
      });
  };

  const handleOpenAuth = (role = 'resident') => {
    setAuthRoleMode(role);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('floodlens_token');
    localStorage.removeItem('floodlens_user');
    setUser(null);
    if (activeTab === 'admin') setActiveTab('overview');
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        onOpenSOS={() => setIsSOSOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Clean Secondary Navigation Tabs for User-Friendly Layout */}
      {activeTab !== 'admin' && activeTab !== 'alerts' && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          borderBottom: '1px solid #cbd5e1',
          paddingBottom: '8px'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'overview' ? '#0284c7' : '#f1f5f9',
              color: activeTab === 'overview' ? '#ffffff' : '#334155',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            📊 Overview
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'analytics' ? '#0284c7' : '#f1f5f9',
              color: activeTab === 'analytics' ? '#ffffff' : '#334155',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            ⏳ Rain & flood history
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'compare' ? '#0284c7' : '#f1f5f9',
              color: activeTab === 'compare' ? '#ffffff' : '#334155',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            ⚖️ Compare areas
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'admin' ? (
        <AdminDashboard />
      ) : activeTab === 'alerts' ? (
        <AlertsView />
      ) : (
        <main style={{ flex: 1 }}>
          {/* Cascading All-India Filter */}
          <Filters
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onReset={() => {
              setStartDate(DEFAULT_START);
              setEndDate(DEFAULT_END);
            }}
          />

          {loading && (
            <p role="status" style={{ color: '#475569', margin: '0 0 12px' }}>
              Updating information...
            </p>
          )}
          {error && (
            <p role="alert" style={{ color: '#b91c1c', margin: '0 0 12px' }}>
              {error}
            </p>
          )}

          {activeTab === 'overview' && (
            <>
              {summary && <SummaryCards summary={summary} />}
              <RiskAssessmentCard location={selectedLocation} />
            </>
          )}

          {/* TAB 1: City Overview (Clean Map & Rainfall Chart) */}
          {activeTab === 'overview' && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
                gap: '16px',
                marginBottom: '18px'
              }}>
                <RainfallChart
                  data={rainfallData}
                  location={selectedLocation}
                  startDate={startDate}
                  endDate={endDate}
                />
                <FloodMap
                  data={floodData}
                  location={selectedLocation}
                />
              </div>

              {/* Natural Language Explanation Box */}
              {summary?.explanation && (
                <div style={{
                  background: '#f8fafc',
                  borderLeft: '4px solid #0284c7',
                  padding: '12px 16px',
                  borderRadius: '0 6px 6px 0',
                  marginBottom: '16px',
                  fontSize: '0.86rem',
                  color: '#334155'
                }}>
                  <strong>📋 Telemetry Summary:</strong> {summary.explanation}
                </div>
              )}

              {/* Collapsible Section for Technical Audit */}
              <div style={{ marginBottom: '16px' }}>
                <button
                  onClick={() => setShowAdvancedAudit(!showAdvancedAudit)}
                  style={{
                    background: 'none',
                    border: '1px dashed #cbd5e1',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {showAdvancedAudit ? '▲ Hide Advanced Quality Audit' : '▼ Show Telemetry Quality Audit & Sources'}
                </button>

                {showAdvancedAudit && (
                  <div style={{ marginTop: '14px' }}>
                    {quality && <DataQualityPanel quality={quality} />}
                    <DataSourcesPanel />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Timeline & Historical Impact */}
          {activeTab === 'analytics' && (
            <div>
              <RainImpactTimeline
                rainfall={rainfallData}
                floods={floodData}
                location={selectedLocation}
              />
              <BlindSpotDetector />
            </div>
          )}

          {/* TAB 3: City Comparison */}
          {activeTab === 'compare' && (
            <div>
              <LocalityComparison
                locations={locations}
                onCompare={handleCompare}
                compareData={compareData}
                loading={loading}
              />
            </div>
          )}
        </main>
      )}

      <Disclaimer />

      {/* Emergency & Auth Modals */}
      <EmergencyModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        defaultLocation={selectedLocation}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialRole={authRoleMode}
        onLoginSuccess={(u) => {
          setUser(u);
          if (u.role === 'admin') {
            setActiveTab('admin');
          }
        }}
      />

      {/* Floating AI Flood Intelligence Assistant */}
      <AIAssistant
        location={selectedLocation}
        summary={summary}
        risk={quality}
      />
    </div>
  );
}

export default App;
