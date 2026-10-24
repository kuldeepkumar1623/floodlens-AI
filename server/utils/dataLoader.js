const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

// In-memory cache
let rainfallCache = [];
let floodHistoryCache = [];
let validationErrorsCache = [];
let dataLoaded = false;

/**
 * Parse a CSV file and return an array of objects.
 * Returns empty array if the file doesn't exist.
 */
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: File not found: ${filePath}`);
      resolve([]);
      return;
    }

    const records = [];
    const parser = fs
      .createReadStream(filePath)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
          relax_column_count: true,
        })
      );

    parser.on('data', (record) => {
      records.push(record);
    });

    parser.on('end', () => {
      resolve(records);
    });

    parser.on('error', (err) => {
      console.error(`Error parsing ${filePath}:`, err.message);
      resolve([]); // return empty rather than crashing
    });
  });
}

/**
 * Validate a single rainfall record.
 * Returns { valid, record, errors }
 */
function validateRainfallRecord(record, index) {
  const errors = [];
  const missingFields = [];

  // Check required fields
  if (!record.date || record.date.trim() === '') {
    errors.push('Missing date');
    missingFields.push('date');
  } else {
    const parsed = new Date(record.date);
    if (isNaN(parsed.getTime())) {
      errors.push(`Invalid date: "${record.date}"`);
    }
  }

  if (!record.location || record.location.trim() === '') {
    errors.push('Missing location');
    missingFields.push('location');
  }

  if (record.rainfall_mm === undefined || record.rainfall_mm === null || record.rainfall_mm === '') {
    errors.push('Missing rainfall_mm');
    missingFields.push('rainfall_mm');
  } else {
    const val = parseFloat(record.rainfall_mm);
    if (isNaN(val)) {
      errors.push(`Invalid rainfall_mm: "${record.rainfall_mm}"`);
    } else if (val < 0) {
      errors.push(`Negative rainfall_mm: ${val}`);
    }
  }

  // Parse the numeric value only if valid — never convert missing to zero
  let rainfallValue = null;
  if (record.rainfall_mm !== undefined && record.rainfall_mm !== null && record.rainfall_mm !== '') {
    const parsed = parseFloat(record.rainfall_mm);
    if (!isNaN(parsed) && parsed >= 0) {
      rainfallValue = parsed;
    }
  }

  return {
    valid: errors.length === 0,
    record: {
      date: record.date || null,
      location: record.location || null,
      rainfall_mm: rainfallValue,
      source: record.source || null,
      _missingFields: missingFields,
      _rowIndex: index,
    },
    errors:
      errors.length > 0
        ? { rowIndex: index, type: 'rainfall', errors }
        : null,
  };
}

/**
 * Validate a single flood history record.
 * Returns { valid, record, errors }
 */
function validateFloodHistoryRecord(record, index) {
  const errors = [];
  const missingFields = [];

  // Check required fields
  if (!record.incident_date || record.incident_date.trim() === '') {
    errors.push('Missing incident_date');
    missingFields.push('incident_date');
  } else {
    const parsed = new Date(record.incident_date);
    if (isNaN(parsed.getTime())) {
      errors.push(`Invalid incident_date: "${record.incident_date}"`);
    }
  }

  if (!record.location || record.location.trim() === '') {
    errors.push('Missing location');
    missingFields.push('location');
  }

  if (!record.incident_type || record.incident_type.trim() === '') {
    missingFields.push('incident_type');
  }

  if (!record.source || record.source.trim() === '') {
    missingFields.push('source');
  }

  if (!record.verification_status || record.verification_status.trim() === '') {
    missingFields.push('verification_status');
  }

  // Validate coordinates — they CAN be empty, but if present must be valid
  let lat = null;
  let lng = null;
  let validCoordinates = false;

  if (record.latitude !== undefined && record.latitude !== null && record.latitude.toString().trim() !== '') {
    lat = parseFloat(record.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push(`Invalid latitude: "${record.latitude}"`);
      lat = null;
    }
  } else {
    missingFields.push('latitude');
  }

  if (record.longitude !== undefined && record.longitude !== null && record.longitude.toString().trim() !== '') {
    lng = parseFloat(record.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push(`Invalid longitude: "${record.longitude}"`);
      lng = null;
    }
  } else {
    missingFields.push('longitude');
  }

  if (lat !== null && lng !== null) {
    validCoordinates = true;
  }

  return {
    valid: errors.length === 0,
    record: {
      incident_date: record.incident_date || null,
      location: record.location ? record.location.trim() : null,
      latitude: lat,
      longitude: lng,
      incident_type: record.incident_type ? record.incident_type.trim() : null,
      source: record.source ? record.source.trim() : null,
      verification_status: record.verification_status ? record.verification_status.trim() : null,
      validCoordinates,
      _missingFields: missingFields,
      _rowIndex: index,
    },
    errors:
      errors.length > 0
        ? { rowIndex: index, type: 'flood_history', errors }
        : null,
  };
}

/**
 * Load and validate both CSV files.
 * Caches data in memory.
 */
async function loadAllData() {
  const dataDir = path.join(__dirname, '..', '..', 'data');
  const rainfallPath = path.join(dataDir, 'rainfall.csv');
  const floodPath = path.join(dataDir, 'flood_history.csv');

  const [rawRainfall, rawFlood] = await Promise.all([
    parseCSV(rainfallPath),
    parseCSV(floodPath),
  ]);

  const validationErrors = [];

  // Validate rainfall records
  const validatedRainfall = rawRainfall.map((r, i) => validateRainfallRecord(r, i));
  rainfallCache = validatedRainfall.map((v) => v.record);
  validatedRainfall.forEach((v) => {
    if (v.errors) validationErrors.push(v.errors);
  });

  // Validate flood history records
  const validatedFlood = rawFlood.map((r, i) => validateFloodHistoryRecord(r, i));
  floodHistoryCache = validatedFlood.map((v) => v.record);
  validatedFlood.forEach((v) => {
    if (v.errors) validationErrors.push(v.errors);
  });

  validationErrorsCache = validationErrors;
  dataLoaded = true;

  return {
    rainfall: rainfallCache,
    floodHistory: floodHistoryCache,
    validationErrors,
  };
}

/**
 * Filter rainfall data by location and optional date range.
 */
function getRainfallData(location, startDate, endDate) {
  let data = rainfallCache;

  if (location) {
    data = data.filter(
      (r) => r.location && r.location.toLowerCase() === location.toLowerCase()
    );
  }

  if (startDate) {
    const start = new Date(startDate);
    if (!isNaN(start.getTime())) {
      data = data.filter((r) => {
        if (!r.date) return false;
        const d = new Date(r.date);
        return !isNaN(d.getTime()) && d >= start;
      });
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (!isNaN(end.getTime())) {
      data = data.filter((r) => {
        if (!r.date) return false;
        const d = new Date(r.date);
        return !isNaN(d.getTime()) && d <= end;
      });
    }
  }

  return data;
}

/**
 * Filter flood history by location and optional date range.
 */
function getFloodHistory(location, startDate, endDate) {
  let data = floodHistoryCache;

  if (location) {
    data = data.filter(
      (r) =>
        r.location && r.location.toLowerCase() === location.toLowerCase()
    );
  }

  if (startDate) {
    const start = new Date(startDate);
    if (!isNaN(start.getTime())) {
      data = data.filter((r) => {
        if (!r.incident_date) return false;
        const d = new Date(r.incident_date);
        return !isNaN(d.getTime()) && d >= start;
      });
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (!isNaN(end.getTime())) {
      data = data.filter((r) => {
        if (!r.incident_date) return false;
        const d = new Date(r.incident_date);
        return !isNaN(d.getTime()) && d <= end;
      });
    }
  }

  return data;
}

/**
 * Return unique location names from both datasets.
 */
function getLocations() {
  const locSet = new Set();
  rainfallCache.forEach((r) => {
    if (r.location) locSet.add(r.location);
  });
  floodHistoryCache.forEach((r) => {
    if (r.location) locSet.add(r.location);
  });
  return Array.from(locSet).sort();
}

/**
 * Return all data for a single location.
 */
function getDataForLocation(location) {
  return {
    rainfall: getRainfallData(location),
    floodHistory: getFloodHistory(location),
  };
}

/**
 * Check whether data has been loaded.
 */
function isDataLoaded() {
  return dataLoaded;
}

/**
 * Get cached validation errors.
 */
function getValidationErrors() {
  return validationErrorsCache;
}

module.exports = {
  loadAllData,
  getRainfallData,
  getFloodHistory,
  getLocations,
  getDataForLocation,
  isDataLoaded,
  getValidationErrors,
};
