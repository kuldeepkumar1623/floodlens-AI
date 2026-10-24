/**
 * Data Quality Assessment Module for FloodLens.
 *
 * Provides deterministic quality metrics and human-readable explanations
 * based on actual data coverage. Never invents data or makes predictions.
 */

/**
 * Assess data quality for a given location.
 *
 * @param {string} location
 * @param {Array} rainfallData  — pre-filtered rainfall records for this location
 * @param {Array} floodData     — pre-filtered flood records for this location
 * @returns {Object}            — quality assessment object
 */
function assessDataQuality(location, rainfallData, floodData) {
  const totalObservations = rainfallData.length;

  // Determine date range from rainfall data
  let firstDate = null;
  let lastDate = null;
  const observedDates = new Set();

  rainfallData.forEach((r) => {
    if (!r.date) return;
    const d = new Date(r.date);
    if (isNaN(d.getTime())) return;
    observedDates.add(r.date);
    if (!firstDate || d < firstDate) firstDate = d;
    if (!lastDate || d > lastDate) lastDate = d;
  });

  const dateRange =
    firstDate && lastDate
      ? { first: firstDate.toISOString().split('T')[0], last: lastDate.toISOString().split('T')[0] }
      : { first: null, last: null };

  const lastObservation = dateRange.last;

  // Days since last observation
  let daysSinceLastObservation = null;
  if (lastDate) {
    const now = new Date();
    daysSinceLastObservation = Math.floor(
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Missing field counts across rainfall records
  const missingFieldCounts = {};
  rainfallData.forEach((r) => {
    if (r._missingFields && r._missingFields.length > 0) {
      r._missingFields.forEach((field) => {
        missingFieldCounts[field] = (missingFieldCounts[field] || 0) + 1;
      });
    }
  });

  // Also count missing fields in flood data
  floodData.forEach((r) => {
    if (r._missingFields && r._missingFields.length > 0) {
      r._missingFields.forEach((field) => {
        const key = `flood_${field}`;
        missingFieldCounts[key] = (missingFieldCounts[key] || 0) + 1;
      });
    }
  });

  // Invalid record count
  const invalidRecordCount = rainfallData.filter(
    (r) => r._missingFields && r._missingFields.length > 0
  ).length;

  // Completeness: ratio of observation days to total days in range
  let completeness = null;
  if (firstDate && lastDate) {
    const totalDaysInRange =
      Math.floor(
        (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    if (totalDaysInRange > 0) {
      completeness = parseFloat(
        (observedDates.size / totalDaysInRange).toFixed(4)
      );
    }
  }

  // Quality label determination
  let qualityLabel = 'Insufficient';
  let qualityReason = '';

  if (totalObservations < 5) {
    qualityLabel = 'Insufficient';
    qualityReason = `Only ${totalObservations} observation(s) available for ${location}. At least 5 observations are needed for any meaningful assessment.`;
  } else if (completeness !== null && completeness < 0.3) {
    qualityLabel = 'Insufficient';
    qualityReason = `Data completeness is ${(completeness * 100).toFixed(1)}% for ${location}, which is below the 30% threshold needed for a partial assessment.`;
  } else if (
    completeness !== null &&
    completeness >= 0.6 &&
    daysSinceLastObservation !== null &&
    daysSinceLastObservation <= 90
  ) {
    qualityLabel = 'Sufficient';
    qualityReason = `Data completeness is ${(completeness * 100).toFixed(1)}% for ${location} and the most recent observation is ${daysSinceLastObservation} day(s) ago, within the 90-day recency threshold.`;
  } else if (
    completeness !== null &&
    completeness >= 0.3 &&
    daysSinceLastObservation !== null &&
    daysSinceLastObservation > 180
  ) {
    qualityLabel = 'Outdated';
    qualityReason = `Data completeness is ${(completeness * 100).toFixed(1)}% for ${location}, but the most recent observation is ${daysSinceLastObservation} day(s) ago, exceeding the 180-day recency threshold.`;
  } else if (
    completeness !== null &&
    completeness >= 0.3 &&
    daysSinceLastObservation !== null &&
    daysSinceLastObservation <= 180
  ) {
    qualityLabel = 'Partial';
    qualityReason = `Data completeness is ${(completeness * 100).toFixed(1)}% for ${location} and the most recent observation is ${daysSinceLastObservation} day(s) ago. Coverage is partial but within recency limits.`;
  } else {
    qualityLabel = 'Insufficient';
    qualityReason = `Unable to fully assess data quality for ${location} due to missing date range or completeness information.`;
  }

  // Flood incident counts
  const floodIncidentCount = floodData.length;
  const verifiedIncidentCount = floodData.filter(
    (f) =>
      f.verification_status &&
      f.verification_status.toLowerCase().includes('verified') &&
      !f.verification_status.toLowerCase().includes('unverified')
  ).length;
  const unverifiedIncidentCount = floodData.filter(
    (f) =>
      f.verification_status &&
      (f.verification_status.toLowerCase().includes('unverified') ||
        f.verification_status.toLowerCase().includes('pending'))
  ).length;

  return {
    location,
    totalObservations,
    dateRange,
    lastObservation,
    daysSinceLastObservation,
    missingFieldCounts,
    invalidRecordCount,
    completeness,
    qualityLabel,
    qualityReason,
    floodIncidentCount,
    verifiedIncidentCount,
    unverifiedIncidentCount,
  };
}

/**
 * Generate a deterministic text explanation for a location's data.
 *
 * @param {string} location
 * @param {Array}  rainfallData  — pre-filtered rainfall records
 * @param {Array}  floodData     — pre-filtered flood records
 * @param {string} [startDate]   — optional start of query range
 * @param {string} [endDate]     — optional end of query range
 * @returns {string}
 */
function generateExplanation(location, rainfallData, floodData, startDate, endDate) {
  const totalObs = rainfallData.length;
  const incidents = floodData.length;

  if (totalObs === 0 && incidents === 0) {
    return `No rainfall observations or flood incidents are recorded for ${location} in the selected period.`;
  }

  // Determine date bounds
  const dates = rainfallData
    .filter((r) => r.date)
    .map((r) => new Date(r.date))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => a - b);

  const displayStart = startDate || (dates.length > 0 ? dates[0].toISOString().split('T')[0] : 'unknown');
  const displayEnd = endDate || (dates.length > 0 ? dates[dates.length - 1].toISOString().split('T')[0] : 'unknown');

  // Completeness
  let completenessText = '';
  if (dates.length >= 2) {
    const totalDays =
      Math.floor(
        (dates[dates.length - 1].getTime() - dates[0].getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    const uniqueDays = new Set(
      dates.map((d) => d.toISOString().split('T')[0])
    ).size;
    const pct = ((uniqueDays / totalDays) * 100).toFixed(1);
    completenessText = `Data completeness is approximately ${pct}%.`;
  }

  // Build limitation text
  const limitations = [];
  const missingRainfallFields = rainfallData.filter(
    (r) => r._missingFields && r._missingFields.length > 0
  ).length;
  if (missingRainfallFields > 0) {
    limitations.push(
      `${missingRainfallFields} rainfall record(s) have missing fields`
    );
  }

  const missingCoords = floodData.filter((f) => !f.validCoordinates).length;
  if (missingCoords > 0) {
    limitations.push(
      `${missingCoords} flood incident(s) lack valid coordinates and cannot be mapped`
    );
  }

  const unverified = floodData.filter(
    (f) =>
      f.verification_status &&
      (f.verification_status.toLowerCase().includes('unverified') ||
        f.verification_status.toLowerCase().includes('pending'))
  ).length;
  if (unverified > 0) {
    limitations.push(
      `${unverified} incident(s) are unverified or pending verification`
    );
  }

  const limitationText =
    limitations.length > 0
      ? `Limitations: ${limitations.join('; ')}.`
      : 'No significant data quality limitations were identified.';

  return (
    `Rainfall observations are available for ${totalObs} dates in the selected period (${displayStart} to ${displayEnd}). ` +
    `${incidents} historical flood incident(s) are recorded. ` +
    `${completenessText} ${limitationText}`
  ).trim();
}

/**
 * Compare data quality and statistics across 2-3 locations.
 *
 * @param {Array<string>} locations      — 2-3 location names
 * @param {Function}      getRainfall    — function(location) → rainfallData
 * @param {Function}      getFlood       — function(location) → floodData
 * @param {string}        [startDate]
 * @param {string}        [endDate]
 * @returns {Object}
 */
function compareLocalities(locations, getRainfall, getFlood, startDate, endDate) {
  const results = {};
  const warnings = [];

  locations.forEach((loc) => {
    const rain = getRainfall(loc);
    const flood = getFlood(loc);
    const quality = assessDataQuality(loc, rain, flood);

    // Basic statistics
    const validValues = rain
      .filter((r) => r.rainfall_mm !== null)
      .map((r) => r.rainfall_mm);

    const totalRainfall = validValues.reduce((sum, v) => sum + v, 0);
    const avgRainfall =
      validValues.length > 0 ? totalRainfall / validValues.length : null;
    const maxRainfall =
      validValues.length > 0 ? Math.max(...validValues) : null;

    results[loc] = {
      quality,
      statistics: {
        totalRainfall: parseFloat(totalRainfall.toFixed(2)),
        avgRainfall: avgRainfall !== null ? parseFloat(avgRainfall.toFixed(2)) : null,
        maxRainfall,
        observationCount: rain.length,
        floodIncidents: flood.length,
      },
    };
  });

  // Generate warnings about coverage differences
  const completenessValues = locations
    .map((loc) => ({
      location: loc,
      completeness: results[loc].quality.completeness,
      observations: results[loc].quality.totalObservations,
    }))
    .filter((v) => v.completeness !== null);

  if (completenessValues.length >= 2) {
    const maxComp = Math.max(...completenessValues.map((v) => v.completeness));
    const minComp = Math.min(...completenessValues.map((v) => v.completeness));
    if (maxComp - minComp > 0.2) {
      const best = completenessValues.find((v) => v.completeness === maxComp);
      const worst = completenessValues.find((v) => v.completeness === minComp);
      warnings.push(
        `Significant coverage difference: ${best.location} has ${(best.completeness * 100).toFixed(1)}% completeness vs ${worst.location} at ${(worst.completeness * 100).toFixed(1)}%. Comparisons may be skewed.`
      );
    }
  }

  const obsValues = locations.map((loc) => ({
    location: loc,
    count: results[loc].quality.totalObservations,
  }));
  const maxObs = Math.max(...obsValues.map((v) => v.count));
  const minObs = Math.min(...obsValues.map((v) => v.count));
  if (maxObs > 0 && minObs / maxObs < 0.5) {
    warnings.push(
      `Observation counts vary significantly across locations (${minObs} to ${maxObs}). Direct comparisons should be made with caution.`
    );
  }

  return {
    locations,
    startDate: startDate || null,
    endDate: endDate || null,
    results,
    warnings,
  };
}

module.exports = {
  assessDataQuality,
  generateExplanation,
  compareLocalities,
};
