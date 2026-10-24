import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  LineController,
  ScatterController,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Explicitly register BarController, LineController, and ScatterController for mixed charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  LineController,
  ScatterController,
  Tooltip,
  Legend
);

function RainImpactTimeline({ rainfall, floods, location }) {
  const chartData = useMemo(() => {
    if (!rainfall || rainfall.length === 0) return null;

    // Collect all dates from rainfall and sort
    const dateMap = new Map();
    rainfall.forEach((r) => {
      dateMap.set(r.date, { rain: r.rainfall_mm, incidents: [] });
    });

    (floods || []).forEach((f) => {
      if (f.incident_date) {
        if (!dateMap.has(f.incident_date)) {
          dateMap.set(f.incident_date, { rain: null, incidents: [f] });
        } else {
          dateMap.get(f.incident_date).incidents.push(f);
        }
      }
    });

    const sortedDates = Array.from(dateMap.keys()).sort((a, b) => new Date(a) - new Date(b));
    const rainData = [];
    const incidentData = [];
    const maxRain = Math.max(...rainfall.map((r) => r.rainfall_mm || 0), 50);

    sortedDates.forEach((d) => {
      const entry = dateMap.get(d);
      rainData.push(entry.rain);
      if (entry.incidents.length > 0) {
        incidentData.push(maxRain * 0.9); // place markers near top of chart
      } else {
        incidentData.push(null);
      }
    });

    return {
      labels: sortedDates,
      datasets: [
        {
          type: 'bar',
          label: 'Daily Rainfall (mm)',
          data: rainData,
          backgroundColor: '#1a73e8',
          borderRadius: 2,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Historical Flood Incident',
          data: incidentData,
          backgroundColor: '#d93025',
          borderColor: '#b31412',
          pointRadius: 8,
          pointHoverRadius: 11,
          pointStyle: 'triangle',
          showLine: false,
          yAxisID: 'y',
        },
      ],
      rawEntries: dateMap,
    };
  }, [rainfall, floods]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const date = context.label;
            const entry = chartData?.rawEntries?.get(date);
            if (context.dataset.type === 'line' || context.dataset.label.includes('Flood')) {
              if (entry && entry.incidents && entry.incidents.length > 0) {
                const types = entry.incidents.map((i) => `${i.incident_type} (${i.verification_status})`).join(', ');
                return `🚨 Incident: ${types}`;
              }
              return 'Flood incident recorded';
            }
            const val = context.raw;
            return val !== null ? `🌧️ Rainfall: ${val.toFixed(1)} mm` : 'No rainfall observation recorded';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Rainfall Depth (mm)',
          font: { weight: 'bold' },
        },
        grid: {
          color: '#f1f3f4',
        },
      },
      x: {
        ticks: {
          maxTicksLimit: 14,
          maxRotation: 45,
          color: '#5f6368',
        },
        grid: {
          display: false,
        },
      },
    },
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#202124', fontWeight: 600 }}>
            ⏳ Rain and past floods in {location}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#5f6368' }}>
            Rainfall is shown by day; markers show dates when floods were recorded.
          </p>
        </div>
      </div>

      <div style={{ height: '320px', position: 'relative' }}>
        {chartData ? (
          <Chart type="bar" data={chartData} options={options} />
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#80868b' }}>
            Insufficient observations to render timeline.
          </div>
        )}
      </div>
    </section>
  );
}

export default RainImpactTimeline;
