import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path in React/Vite builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically pan/zoom map when location focus changes
function MapViewUpdater({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

const CITY_COORDINATES = {
  Mumbai: [19.076, 72.8777],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Delhi: [28.7041, 77.1025],
  Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
  Jaipur: [26.9124, 75.7873],
  Ahmedabad: [23.0225, 72.5714],
};

function FloodMap({ data, location }) {
  const validIncidents = useMemo(() => {
    return (data || []).filter(
      (d) =>
        d.validCoordinates &&
        d.latitude !== null &&
        d.longitude !== null &&
        !isNaN(d.latitude) &&
        !isNaN(d.longitude)
    );
  }, [data]);

  const mapCenter = CITY_COORDINATES[location] || [20.5937, 78.9629];
  const mapZoom = CITY_COORDINATES[location] ? 10 : 5;

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
            🗺️ Past flood reports
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#5f6368' }}>
            {validIncidents.length} reports with map locations · {location}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, background: '#d93025', display: 'inline-block', borderRadius: '50%' }} /> Verified
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, background: '#e37400', display: 'inline-block', borderRadius: '50%' }} /> Unverified/Pending
          </span>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <MapViewUpdater center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {validIncidents.map((inc, idx) => {
            const isVerified = (inc.verification_status || '').toLowerCase().includes('verified') &&
                              !(inc.verification_status || '').toLowerCase().includes('unverified');
            const color = isVerified ? '#d93025' : '#e37400';

            return (
              <CircleMarker
                key={idx}
                center={[inc.latitude, inc.longitude]}
                radius={8}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.7,
                  weight: 2
                }}
              >
                <Popup>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong style={{ color: '#202124' }}>{inc.incident_type}</strong>
                    <br />
                    <span>📅 <strong>Date:</strong> {inc.incident_date}</span>
                    <br />
                    <span>📍 <strong>Locality:</strong> {inc.location}</span>
                    <br />
                    <span>
                      <strong>Report status:</strong>{' '}
                      <span style={{ color: isVerified ? '#0d904f' : '#e37400', fontWeight: 600 }}>
                        {inc.verification_status}
                      </span>
                    </span>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default FloodMap;
