import React from 'react';

function LocalityExplanation({ explanation, location }) {
  return (
    <section style={{
      background: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #dadce0',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '1.2rem' }}>💡</span>
        <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#202124', fontWeight: 600 }}>
          Innovation B: Evidence-Based Locality Explanation ({location})
        </h3>
      </div>

      <div style={{
        background: '#e8f0fe',
        borderLeft: '4px solid #1a73e8',
        padding: '14px 16px',
        borderRadius: '0 6px 6px 0',
        marginBottom: '10px'
      }}>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#174ea6', lineHeight: 1.6, fontWeight: 500 }}>
          {explanation || 'No historical records or observations match the active selection criteria.'}
        </p>
      </div>

      <p style={{ margin: 0, fontSize: '0.78rem', color: '#5f6368', fontStyle: 'italic' }}>
        * Deterministic evaluation synthesized strictly from parsed meteorological logs and official disaster reports. It does NOT generate unverified risk probabilities or flood alerts.
      </p>
    </section>
  );
}

export default LocalityExplanation;

