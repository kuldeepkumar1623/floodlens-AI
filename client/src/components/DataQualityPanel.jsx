import React from 'react';
import { getQualityColor, getQualityBgColor, getQualityIcon } from '../utils/helpers';

function DataQualityPanel({ quality }) {
  if (!quality) return null;

  const {
    location,
    totalObservations,
    dateRange,
    lastObservation,
    daysSinceLastObservation,
    completeness,
    qualityLabel,
    qualityReason,
    missingFieldCounts,
    invalidRecordCount,
    floodIncidentCount,
    verifiedIncidentCount,
  } = quality;

  const color = getQualityColor(qualityLabel);
  const bg = getQualityBgColor(qualityLabel);
  const icon = getQualityIcon(qualityLabel);
  const pct = completeness ? (completeness * 100).toFixed(0) : 0;

  return (
    <section style={{
      background: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #dadce0',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#202124', fontWeight: 600 }}>
          📊 Locality Data Quality & Completeness Audit ({location})
        </h3>
        <span style={{
          background: bg,
          color: color,
          padding: '6px 12px',
          borderRadius: '16px',
          fontWeight: 700,
          fontSize: '0.85rem'
        }}>
          {icon} {qualityLabel} Coverage
        </span>
      </div>

      <p style={{ color: '#3c4043', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
        {qualityReason}
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', color: '#5f6368' }}>
          <span>Temporal Coverage Completeness</span>
          <span style={{ fontWeight: 600, color: '#202124' }}>{pct}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#f1f3f4', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px' }} />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        background: '#f8f9fa',
        padding: '12px 16px',
        borderRadius: '6px',
        fontSize: '0.82rem'
      }}>
        <div>
          <span style={{ color: '#5f6368', display: 'block' }}>First / Last Recorded:</span>
          <strong>{dateRange?.first || 'N/A'} → {dateRange?.last || 'N/A'}</strong>
        </div>
        <div>
          <span style={{ color: '#5f6368', display: 'block' }}>Data Recency:</span>
          <strong>{daysSinceLastObservation !== null ? `${daysSinceLastObservation} days ago` : 'Unknown'}</strong>
        </div>
        <div>
          <span style={{ color: '#5f6368', display: 'block' }}>Records With Missing Fields:</span>
          <strong>{invalidRecordCount} record(s)</strong>
        </div>
        <div>
          <span style={{ color: '#5f6368', display: 'block' }}>Incidents (Verified / Total):</span>
          <strong>{verifiedIncidentCount} / {floodIncidentCount}</strong>
        </div>
      </div>
    </section>
  );
}

export default DataQualityPanel;

