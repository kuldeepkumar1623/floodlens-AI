import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function RainfallChart({ data, location, startDate, endDate }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Sort observations chronologically
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sorted.map((r) => r.date);
    const values = sorted.map((r) => (r.rainfall_mm !== null && r.rainfall_mm !== undefined ? r.rainfall_mm : null));

    // Color code extreme events (>100mm = warning red/orange, normal = blue)
    const backgroundColors = values.map((val) => {
      if (val === null) return 'rgba(200, 200, 200, 0.4)';
      if (val >= 100) return '#d93025';
      if (val >= 50) return '#e37400';
      return '#1a73e8';
    });

    return {
      labels,
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: values,
          backgroundColor: backgroundColors,
          borderRadius: 3,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw;
            if (val === null || val === undefined) return 'Missing Observation';
            return `Rainfall: ${val.toFixed(1)} mm`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Rainfall (mm)',
          color: '#5f6368',
          font: { weight: 'bold', size: 12 },
        },
        grid: {
          color: '#f1f3f4',
        },
      },
      x: {
        ticks: {
          maxTicksLimit: 14,
          maxRotation: 45,
          minRotation: 0,
          color: '#5f6368',
          font: { size: 11 },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{
      background: '#ffffff',
      padding: '18px 20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #dadce0',
      display: 'flex',
      flexDirection: 'column',
      height: '380px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#202124' }}>
            🌧️ Daily Rainfall Observations — {location}
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#5f6368' }}>
            Source: IMD Sample Data | Unit: Millimetres (mm)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, background: '#1a73e8', display: 'inline-block', borderRadius: 2 }} /> Normal
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, background: '#e37400', display: 'inline-block', borderRadius: 2 }} /> Heavy (&ge;50mm)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, background: '#d93025', display: 'inline-block', borderRadius: 2 }} /> Very Heavy (&ge;100mm)
          </span>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#80868b'
          }}>
            No rainfall observations recorded for the selected window.
          </div>
        )}
      </div>
    </div>
  );
}

export default RainfallChart;

