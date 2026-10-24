import React from 'react';

function DataSourcesPanel() {
  return (
    <section style={{
      background: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      marginBottom: '20px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 600 }}>
        📖 Data Ingestion Architecture & Limitations
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px',
        fontSize: '0.85rem'
      }}>
        <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <strong style={{ color: '#0284c7' }}>🌧️ Rainfall Telemetry Source:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#475569' }}>
            India Meteorological Department (IMD) Ground Station Telemetry (sample benchmark series, 2023-2024). Units: Millimetres (mm).
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <strong style={{ color: '#0284c7' }}>🌊 Flood & Inundation Register:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#475569' }}>
            NDMA, CWC Basin Bulletins, and State Disaster Authority reports with geospatial geocoding and verification flags.
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <strong style={{ color: '#0284c7' }}>🤖 AI Ensemble Engine:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#475569' }}>
            XGBoost Environmental Saturation + Temporal Peak Pulse Sequence + Hydro-Topographic Proxy. Uncertainty and calibration logged.
          </p>
        </div>
      </div>
      <p style={{ margin: '12px 0 0 0', fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
        * Transparent Reporting: Gaps in observation schedules are preserved as missing records rather than assumed to be zero rainfall.
      </p>
    </section>
  );
}

export default DataSourcesPanel;

