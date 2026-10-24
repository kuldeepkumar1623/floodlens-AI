import React from 'react';

function SampleDataBanner() {
  return (
    <div style={{
      backgroundColor: 'var(--warning-light)',
      color: 'var(--text-primary)',
      padding: 'var(--spacing-sm)',
      borderRadius: 'var(--border-radius)',
      marginBottom: 'var(--spacing-md)',
      border: `1px solid var(--warning)`,
    }}>
      ⚠️ <strong>SAMPLE DATA — NOT REAL-WORLD OBSERVATIONS.</strong> This dashboard uses synthetic demonstration data for illustration only.
    </div>
  );
}

export default SampleDataBanner;

