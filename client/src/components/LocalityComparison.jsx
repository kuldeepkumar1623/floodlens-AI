import React, { useState } from 'react';
import { getQualityColor, getQualityIcon, formatNumber } from '../utils/helpers';

function LocalityComparison({ locations, onCompare, compareData, loading }) {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const safeLocations = Array.isArray(locations) ? locations : [];

  const toggleLocation = (loc) => {
    if (selectedLocations.includes(loc)) {
      setSelectedLocations(selectedLocations.filter((l) => l !== loc));
    } else {
      if (selectedLocations.length < 3) {
        setSelectedLocations([...selectedLocations, loc]);
      }
    }
  };

  const handleRunComparison = () => {
    if (selectedLocations.length >= 2) {
      onCompare(selectedLocations);
    }
  };

  return (
    <section style={{
      background: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #dadce0',
      marginBottom: '20px'
    }}>
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#202124', fontWeight: 600 }}>
          ⚖️ Multi-Locality Comparison (2 to 3 Localities)
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#5f6368' }}>
          Compare rainfall amounts, reporting completeness, and flood records side-by-side with discrepancy warnings.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
        {safeLocations.map((loc) => {
          const isSelected = selectedLocations.includes(loc);
          return (
            <button
              key={loc}
              type="button"
              onClick={() => toggleLocation(loc)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: isSelected ? '1px solid #1a73e8' : '1px solid #dadce0',
                background: isSelected ? '#e8f0fe' : '#ffffff',
                color: isSelected ? '#1a73e8' : '#3c4043',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {isSelected ? '✓ ' : '+ '} {loc}
            </button>
          );
        })}

        <button
          onClick={handleRunComparison}
          disabled={selectedLocations.length < 2 || loading}
          style={{
            marginLeft: 'auto',
            padding: '8px 18px',
            background: selectedLocations.length >= 2 ? '#1a73e8' : '#dadce0',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: selectedLocations.length >= 2 ? 'pointer' : 'not-allowed',
            fontSize: '0.88rem'
          }}
        >
          {loading ? 'Evaluating...' : 'Compare Selected'}
        </button>
      </div>

      {/* Warnings Banner */}
      {compareData?.warnings && compareData.warnings.length > 0 && (
        <div style={{
          background: '#fef7e0',
          borderLeft: '4px solid #f9ab00',
          padding: '10px 14px',
          borderRadius: '0 4px 4px 0',
          marginBottom: '14px',
          fontSize: '0.84rem',
          color: '#b06000'
        }}>
          <strong>⚠️ Uneven Reporting Warning:</strong>
          <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
            {compareData.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Comparison Results Table */}
      {compareData && compareData.results && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #dadce0', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', width: '220px' }}>Metric</th>
                {compareData.locations.map((loc) => (
                  <th key={loc} style={{ padding: '10px 14px' }}>{loc}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#5f6368' }}>Data Quality Tier</td>
                {compareData.locations.map((loc) => {
                  const q = compareData.results[loc]?.quality;
                  const label = q?.qualityLabel || 'N/A';
                  return (
                    <td key={loc} style={{ padding: '10px 14px' }}>
                      <span style={{ color: getQualityColor(label), fontWeight: 600 }}>
                        {getQualityIcon(label)} {label}
                      </span>
                    </td>
                  );
                })}
              </tr>

              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#5f6368' }}>Total Rainfall</td>
                {compareData.locations.map((loc) => (
                  <td key={loc} style={{ padding: '10px 14px', fontWeight: 700, color: '#1a73e8' }}>
                    {formatNumber(compareData.results[loc]?.statistics?.totalRainfall, 1)} mm
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#5f6368' }}>Average Daily Rainfall</td>
                {compareData.locations.map((loc) => (
                  <td key={loc} style={{ padding: '10px 14px' }}>
                    {formatNumber(compareData.results[loc]?.statistics?.avgRainfall, 1)} mm
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#5f6368' }}>Max Single Day Rain</td>
                {compareData.locations.map((loc) => (
                  <td key={loc} style={{ padding: '10px 14px' }}>
                    {formatNumber(compareData.results[loc]?.statistics?.maxRainfall, 1)} mm
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#5f6368' }}>Valid Observations</td>
                {compareData.locations.map((loc) => (
                  <td key={loc} style={{ padding: '10px 14px' }}>
                    {compareData.results[loc]?.statistics?.observationCount || 0}
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#5f6368' }}>Temporal Completeness</td>
                {compareData.locations.map((loc) => {
                  const comp = compareData.results[loc]?.quality?.completeness;
                  return (
                    <td key={loc} style={{ padding: '10px 14px' }}>
                      {comp !== null && comp !== undefined ? `${(comp * 100).toFixed(0)}%` : 'N/A'}
                    </td>
                  );
                })}
              </tr>

              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#5f6368' }}>Historical Flood Incidents</td>
                {compareData.locations.map((loc) => (
                  <td key={loc} style={{ padding: '10px 14px', fontWeight: 700, color: '#d93025' }}>
                    {compareData.results[loc]?.statistics?.floodIncidents || 0}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default LocalityComparison;
