import React from 'react';
import { formatNumber } from '../utils/helpers';

function SummaryCards({ summary }) {
  if (!summary) return null;

  const {
    totalRainfall,
    avgRainfall,
    maxRainfall,
    rainyDays,
    dryDays,
    incidents,
  } = summary;

  const cards = [
    {
      title: 'Total rain',
      value: `${formatNumber(totalRainfall, 1)} mm`,
      subtitle: `Average ${formatNumber(avgRainfall, 1)} mm per day`,
      icon: '🌧️',
      color: '#0284c7',
      bg: '#f0f9ff',
      borderColor: '#bae6fd'
    },
    {
      title: 'Heaviest day',
      value: `${formatNumber(maxRainfall, 1)} mm`,
      subtitle: 'Maximum rainfall in one day',
      icon: '⚡',
      color: '#0369a1',
      bg: '#f8fafc',
      borderColor: '#e2e8f0'
    },
    {
      title: 'Rainy / dry days',
      value: `${rainyDays ?? 0} / ${dryDays ?? 0}`,
      subtitle: 'Based on recorded rainfall',
      icon: '📅',
      color: '#059669',
      bg: '#ecfdf5',
      borderColor: '#a7f3d0'
    },
    {
      title: 'Flood Incidents',
      value: `${incidents ?? 0}`,
      subtitle: 'Past recorded events',
      icon: '🚨',
      color: '#dc2626',
      bg: '#fef2f2',
      borderColor: '#fecaca'
    }
  ];

  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
      gap: '14px',
      marginBottom: '18px'
    }}>
      {cards.map((c, idx) => (
        <div key={idx} style={{
          background: c.bg,
          padding: '16px 18px',
          borderRadius: '10px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: `1px solid ${c.borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.15s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {c.title}
            </span>
            <span style={{ fontSize: '1.25rem' }}>{c.icon}</span>
          </div>
          <div style={{ margin: '8px 0 2px 0' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: c.color }}>
              {c.value}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {c.subtitle}
          </div>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;
