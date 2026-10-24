import React, { useEffect, useState } from 'react';
import { fetchRiskAssessment } from '../api';

function RiskAssessmentCard({ location }) {
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    setAssessment(null);
    setError(false);

    fetchRiskAssessment(location)
      .then((result) => {
        if (isCurrent) setAssessment(result);
      })
      .catch(() => {
        if (isCurrent) setError(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [location]);

  if (!assessment && !error) {
    return (
      <section
        aria-live="polite"
        style={{
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          marginBottom: '18px',
          color: '#475569'
        }}
      >
        Checking flood risk for {location}...
      </section>
    );
  }

  if (error || !assessment) {
    return (
      <section
        role="status"
        style={{
          background: '#fff7ed',
          padding: '16px 20px',
          borderRadius: '10px',
          border: '1px solid #fed7aa',
          marginBottom: '18px',
          color: '#9a3412'
        }}
      >
        Flood risk is temporarily unavailable. Please try again later.
      </section>
    );
  }

  const riskTier = assessment.riskTier;
  const tierColor = assessment.tierColor;
  const tierBg = `${tierColor}14`;

  return (
    <div style={{
      background: '#ffffff',
      padding: '16px 20px',
      borderRadius: '10px',
      border: `1px solid ${tierColor}55`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      marginBottom: '18px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          background: tierBg,
          border: `1px solid ${tierColor}55`,
          color: tierColor,
          padding: '10px 16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Flood risk</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{riskTier}</div>
        </div>

        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>
            Risk overview for {location}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#334155' }}>
            {assessment.actionAdvice}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#64748b' }}>
        Estimate based on available rainfall and past flood records. Follow official local alerts.
      </div>
    </div>
  );
}

export default RiskAssessmentCard;
