import React, { useState, useEffect } from 'react';
import { INDIA_GEOGRAPHY } from '../data/indiaLocations';

const DEFAULT_STATE = 'Maharashtra';
const DEFAULT_DISTRICT = 'Mumbai Suburban';
const DEFAULT_CITY = 'Kurla';

function Filters({
  selectedLocation,
  onLocationChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset
}) {
  // Cascading Selection State: State -> District -> City/Locality
  const [selectedState, setSelectedState] = useState(DEFAULT_STATE);
  const [selectedDistrict, setSelectedDistrict] = useState(DEFAULT_DISTRICT);
  const [selectedCity, setSelectedCity] = useState(selectedLocation || DEFAULT_CITY);

  // Sync internal selectedCity if parent selectedLocation changes
  useEffect(() => {
    if (selectedLocation && selectedLocation !== selectedCity) {
      setSelectedCity(selectedLocation);
    }
  }, [selectedLocation]);

  // Find districts for active state
  const currentStateObj = INDIA_GEOGRAPHY.find((s) => s.state === selectedState) || INDIA_GEOGRAPHY[0];
  const currentDistricts = currentStateObj.districts || [];

  // Find cities for active district
  const currentDistrictObj = currentDistricts.find((d) => d.district === selectedDistrict) || currentDistricts[0];
  const currentCities = currentDistrictObj ? currentDistrictObj.cities : [];

  // Handle State Change
  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    const stateObj = INDIA_GEOGRAPHY.find((s) => s.state === stateName);
    if (stateObj && stateObj.districts.length > 0) {
      const firstDistrict = stateObj.districts[0];
      setSelectedDistrict(firstDistrict.district);
      if (firstDistrict.cities.length > 0) {
        const firstCity = firstDistrict.cities[0];
        setSelectedCity(firstCity);
        onLocationChange(firstCity);
      }
    }
  };

  // Handle District Change
  const handleDistrictChange = (districtName) => {
    setSelectedDistrict(districtName);
    const distObj = currentDistricts.find((d) => d.district === districtName);
    if (distObj && distObj.cities.length > 0) {
      const firstCity = distObj.cities[0];
      setSelectedCity(firstCity);
      onLocationChange(firstCity);
    }
  };

  // Handle City Change
  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    onLocationChange(cityName);
  };

  // Full reset function that resets both geography and dates
  const handleResetFilters = () => {
    setSelectedState(DEFAULT_STATE);
    setSelectedDistrict(DEFAULT_DISTRICT);
    setSelectedCity(DEFAULT_CITY);
    onLocationChange(DEFAULT_CITY);
    if (onReset) {
      onReset();
    }
  };

  return (
    <section style={{
      background: '#ffffff',
      padding: '18px 20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #cbd5e1',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            📍 Choose area and dates
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            Pick a location and time period to view its flood information
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetFilters}
          style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            color: '#b91c1c',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#fecaca')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#fee2e2')}
        >
          🔄 Reset Filters
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px'
      }}>
        {/* Step 1: State Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            State / UT
          </label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              background: '#fff',
              fontWeight: 600,
              color: '#0f172a'
            }}
          >
            {INDIA_GEOGRAPHY.map((s) => (
              <option key={s.state} value={s.state}>
                {s.state}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: District Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              background: '#fff',
              fontWeight: 600,
              color: '#0f172a'
            }}
          >
            {currentDistricts.map((d) => (
              <option key={d.district} value={d.district}>
                {d.district}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: City / Locality Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            City / Locality
          </label>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '2px solid #0284c7',
              fontSize: '0.88rem',
              background: '#f0f9ff',
              fontWeight: 700,
              color: '#0369a1'
            }}
          >
            {currentCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filters */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            From
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              background: '#fff'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
            To
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              background: '#fff'
            }}
          />
        </div>
      </div>

    </section>
  );
}

export default Filters;
