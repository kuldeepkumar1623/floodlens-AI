import React from 'react';

function Disclaimer() {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: '16px 20px',
      background: '#0f172a',
      color: '#94a3b8',
      borderRadius: '8px',
      fontSize: '0.8rem',
      lineHeight: 1.5,
      textAlign: 'center'
    }}>
      <p style={{ margin: 0 }}>
        Demo information only; it may not reflect current conditions. Follow official alerts and call 112 for emergencies.
      </p>
    </footer>
  );
}

export default Disclaimer;
