import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Alert form state
  const [alertTitle, setAlertTitle] = useState('');
  const [alertScope, setAlertScope] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('Critical');
  const [alertAction, setAlertAction] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const token = localStorage.getItem('floodlens_token');

  const fetchData = async () => {
    try {
      const [ovRes, sosRes] = await Promise.all([
        fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/sos', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!ovRes.ok || !sosRes.ok) {
        throw new Error('Administrative privilege verification failed or session expired.');
      }

      const ovData = await ovRes.json();
      const sosData = await sosRes.json();

      setOverview(ovData);
      setSosList(sosData.requests || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetch(`/api/admin/sos/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch (e) {
      alert('Failed to update SOS status');
    }
  };

  const handlePublishAlert = async (e) => {
    e.preventDefault();
    setPublishing(true);
    setPublishSuccess(false);

    try {
      const res = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: alertTitle,
          authority: 'National Disaster Management Authority (Admin Console)',
          geographicScope: alertScope,
          severity: alertSeverity,
          recommendedAction: alertAction
        })
      });

      if (!res.ok) throw new Error('Failed to publish alert');

      setPublishSuccess(true);
      setAlertTitle('');
      setAlertScope('');
      setAlertAction('');
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading administrative telemetry...</div>;
  if (error) return <div style={{ padding: '30px', color: '#dc2626' }}>Security Verification Error: {error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Active SOS Dispatches</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#dc2626' }}>{overview?.activeSOS}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Logged: {overview?.totalSOS}</div>
        </div>

        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Active Weather Alerts</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f59e0b' }}>{overview?.totalAlerts}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Statutory IMD / CWC Advisories</div>
        </div>

        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Monitored Localities</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0284c7' }}>{overview?.monitoredLocations}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Telemetry Ingestion Operational</div>
        </div>

        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Core System Health</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#10b981' }}>100% OK</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Uptime: {Math.floor(overview?.serverTelemetry?.uptimeSeconds || 0)}s</div>
        </div>
      </div>

      {/* SOS Incident Management Table */}
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#0f172a' }}>
          🚨 Emergency SOS Dispatch Queue (Live Response Center)
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px' }}>Request ID</th>
                <th style={{ padding: '8px 12px' }}>Timestamp</th>
                <th style={{ padding: '8px 12px' }}>Location</th>
                <th style={{ padding: '8px 12px' }}>Emergency Category</th>
                <th style={{ padding: '8px 12px' }}>Contact</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
                <th style={{ padding: '8px 12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sosList.map((sos) => (
                <tr key={sos.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{sos.id}</td>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>
                    {new Date(sos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '8px 12px' }}>{sos.location}</td>
                  <td style={{ padding: '8px 12px' }}>{sos.category}</td>
                  <td style={{ padding: '8px 12px' }}>
                    {sos.contactName} ({sos.contactPhone})
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: sos.status === 'Resolved' ? '#dcfce7' : (sos.status === 'Response in Progress' ? '#ffedd5' : '#fee2e2'),
                      color: sos.status === 'Resolved' ? '#15803d' : (sos.status === 'Response in Progress' ? '#c2410c' : '#b91c1c')
                    }}>
                      {sos.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <select
                      value={sos.status}
                      onChange={(e) => handleUpdateStatus(sos.id, e.target.value)}
                      style={{ fontSize: '0.78rem', padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="Received by server">Received</option>
                      <option value="Acknowledged">Acknowledged</option>
                      <option value="Response in Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publish Verified Advisory Form */}
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#0f172a' }}>
          📢 Broadcast Official Public Flood Advisory
        </h3>
        {publishSuccess && (
          <div style={{ background: '#ecfdf5', color: '#047857', padding: '10px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.85rem' }}>
            ✅ Verified Public Flood Advisory Broadcasted to all citizen dashboards.
          </div>
        )}
        <form onSubmit={handlePublishAlert} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Advisory Title / Heading *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Red Warning: High Tide & 200mm Rainfall Influx"
              value={alertTitle}
              onChange={(e) => setAlertTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Geographic Scope *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mumbai Coastal & Kurla/Dadar catchments"
              value={alertScope}
              onChange={(e) => setAlertScope(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Severity Level
            </label>
            <select
              value={alertSeverity}
              onChange={(e) => setAlertSeverity(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            >
              <option value="Critical">Critical (Immediate Hazard)</option>
              <option value="Elevated">Elevated (Precautionary)</option>
              <option value="Watch">Watch (Developing Monsoonal Depression)</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Statutory Citizen Directive
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Evacuate basement premises. Keep torches and water rations handy."
              value={alertAction}
              onChange={(e) => setAlertAction(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={publishing}
            style={{
              gridColumn: 'span 2',
              padding: '10px',
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: publishing ? 'not-allowed' : 'pointer'
            }}
          >
            {publishing ? 'Publishing...' : 'Broadcast Verified Advisory'}
          </button>
        </form>
      </div>

      {/* Audit Log Trail */}
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#0f172a' }}>
          🛡️ Administrative Action Audit Trail
        </h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.8rem' }}>
          {overview?.recentAuditLogs?.map((log) => (
            <div key={log.id} style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <strong>{log.action}</strong> by <code>{log.actor}</code>
              </span>
              <span style={{ color: '#94a3b8' }}>
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

