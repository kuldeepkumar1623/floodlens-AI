import React, { useEffect, useState } from 'react';
import { fetchLocations, fetchDataQuality } from '../api';
import { getQualityColor, getQualityBgColor, getQualityIcon } from '../utils/helpers';

function BlindSpotDetector() {
  const [qualityList, setQualityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchLocations()
      .then(async (res) => {
        const locs = res.locations || [];
        const promises = locs.map((loc) =>
          fetchDataQuality(loc).catch(() => ({
            location: loc,
            qualityLabel: 'Unavailable',
            lastObservation: null,
          }))
        );
        const results = await Promise.all(promises);
        if (isMounted) {
          setQualityList(results);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const qualityOrder = { Insufficient: 0, Outdated: 1, Partial: 2, Sufficient: 3 };
  const prioritizedLocations = [...qualityList].sort(
    (a, b) => (qualityOrder[a.qualityLabel] ?? 4) - (qualityOrder[b.qualityLabel] ?? 4)
  );
  const visibleLocations = showAll ? prioritizedLocations : prioritizedLocations.slice(0, 5);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#202124', fontWeight: 600 }}>
              📡 Area data coverage
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#5f6368' }}>
              Shows where rainfall records are limited. Low coverage does not mean high flood risk.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#5f6368' }}>
          Checking area records...
        </div>
      ) : error ? (
        <p role="alert" style={{ color: '#b91c1c', margin: 0 }}>
          Area coverage could not be loaded. Please try again later.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dadce0', color: '#3c4043', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>Area</th>
                <th style={{ padding: '10px 12px' }}>Coverage</th>
                <th style={{ padding: '10px 12px' }}>Latest record</th>
              </tr>
            </thead>
            <tbody>
              {visibleLocations.map((q, idx) => {
                const label = q.qualityLabel || 'Insufficient';
                const color = getQualityColor(label);
                const bg = getQualityBgColor(label);
                const icon = getQualityIcon(label);

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{q.location}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        background: bg,
                        color: color,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {icon} {label}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {q.lastObservation || 'None'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {prioritizedLocations.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAll((visible) => !visible)}
              style={{
                marginTop: '10px',
                padding: '7px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                background: '#ffffff',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {showAll ? 'Show fewer areas' : `Show all ${prioritizedLocations.length} areas`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default BlindSpotDetector;
