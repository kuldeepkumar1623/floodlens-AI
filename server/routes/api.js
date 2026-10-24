const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const {
  getRainfallData,
  getFloodHistory,
  getLocations,
  getDataForLocation,
  isDataLoaded,
  getValidationErrors,
} = require('../utils/dataLoader');
const {
  assessDataQuality,
  generateExplanation,
  compareLocalities,
} = require('../utils/dataQuality');
const {
  JWT_SECRET,
  getUsers,
  saveUsers,
  authenticateToken,
  requireRole,
} = require('../utils/auth');
const {
  getSOSRequests,
  saveSOSRequests,
  getAlerts,
  saveAlerts,
  logAudit,
  getAuditLogs,
} = require('../utils/store');
const { evaluateRisk } = require('../utils/mlEngine');

/**
 * Public Health check
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dataLoaded: isDataLoaded(),
    modelsActive: ['XGBoost-v2.1', 'LSTM-Pulse-v1.4', 'HydroTerrain-v1.2']
  });
});

/**
 * Authentication Endpoints
 */
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  logAudit('USER_LOGIN', user.email, { role: user.role });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

router.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }

  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: `user-${uuidv4().slice(0, 8)}`,
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'resident',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  logAudit('USER_REGISTERED', email, { name, role: 'resident' });

  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

router.get('/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

/**
 * Geography & Meteorological Endpoints
 */
router.get('/locations', (req, res) => {
  try {
    const locations = getLocations();
    res.json({ locations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

router.get('/rainfall', (req, res) => {
  try {
    const { location, startDate, endDate } = req.query;
    if (!location) {
      return res.status(400).json({ error: 'Missing required parameter: location' });
    }
    const data = getRainfallData(location, startDate, endDate);
    res.json({
      data,
      meta: {
        location,
        startDate: startDate || null,
        endDate: endDate || null,
        totalRecords: data.length,
        source: 'IMD Sample Telemetry'
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rainfall data' });
  }
});

router.get('/flood-history', (req, res) => {
  try {
    const { location, startDate, endDate } = req.query;
    const data = getFloodHistory(location || null, startDate || null, endDate || null);
    res.json({
      data,
      meta: {
        location: location || 'all',
        startDate: startDate || null,
        endDate: endDate || null,
        totalRecords: data.length,
        recordsWithValidCoordinates: data.filter((d) => d.validCoordinates).length,
        source: 'NDMA/CWC Sample Register'
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flood history' });
  }
});

router.get('/data-quality', (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: 'Missing location parameter' });
    }
    const rainfallData = getRainfallData(location);
    const floodData = getFloodHistory(location);
    const quality = assessDataQuality(location, rainfallData, floodData);
    res.json(quality);
  } catch (err) {
    res.status(500).json({ error: 'Failed to assess quality' });
  }
});

router.get('/summary', (req, res) => {
  try {
    const { location, startDate, endDate } = req.query;
    if (!location) {
      return res.status(400).json({ error: 'Missing location parameter' });
    }
    const rainfallData = getRainfallData(location, startDate, endDate);
    const floodData = getFloodHistory(location, startDate, endDate);

    const validValues = rainfallData
      .filter((r) => r.rainfall_mm !== null)
      .map((r) => r.rainfall_mm);

    const totalRainfall = validValues.length > 0 ? parseFloat(validValues.reduce((a, b) => a + b, 0).toFixed(2)) : 0;
    const avgRainfall = validValues.length > 0 ? parseFloat((totalRainfall / validValues.length).toFixed(2)) : null;
    const maxRainfall = validValues.length > 0 ? Math.max(...validValues) : null;
    const rainyDays = validValues.filter((v) => v > 2.5).length;
    const dryDays = validValues.filter((v) => v <= 2.5).length;

    const explanation = generateExplanation(location, rainfallData, floodData, startDate, endDate);

    res.json({
      location,
      startDate: startDate || null,
      endDate: endDate || null,
      totalRainfall,
      avgRainfall,
      maxRainfall,
      rainyDays,
      dryDays,
      incidents: floodData.length,
      explanation
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

router.get('/compare', (req, res) => {
  try {
    const { locations, startDate, endDate } = req.query;
    if (!locations) {
      return res.status(400).json({ error: 'Locations required' });
    }
    const list = locations.split(',').map((l) => l.trim()).filter(Boolean);
    const comparison = compareLocalities(
      list,
      (loc) => getRainfallData(loc, startDate, endDate),
      (loc) => getFloodHistory(loc, startDate, endDate),
      startDate,
      endDate
    );
    res.json(comparison);
  } catch (err) {
    res.status(500).json({ error: 'Comparison failed' });
  }
});

/**
 * AI Flood Risk Engine Endpoint
 */
router.get('/risk-assessments', (req, res) => {
  try {
    const { location } = req.query;
    const loc = location || 'Mumbai';
    const rainfall = getRainfallData(loc);
    const floodHistory = getFloodHistory(loc);
    const assessment = evaluateRisk(loc, rainfall, floodHistory);
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate risk assessment' });
  }
});

/**
 * Alerts & Official Warnings Endpoints
 */
router.get('/alerts', (req, res) => {
  try {
    const alerts = getAlerts();
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

router.post('/admin/alerts', authenticateToken, requireRole('admin'), (req, res) => {
  try {
    const { title, authority, geographicScope, severity, recommendedAction } = req.body;
    if (!title || !authority || !geographicScope) {
      return res.status(400).json({ error: 'Title, authority, and geographicScope required' });
    }

    const alerts = getAlerts();
    const newAlert = {
      id: `ALT-${uuidv4().slice(0, 8)}`,
      title,
      authority,
      geographicScope,
      issuedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 86400000 * 2).toISOString(),
      severity: severity || 'Elevated',
      recommendedAction: recommendedAction || 'Follow official civic advisories.',
      verified: true
    };

    alerts.unshift(newAlert);
    saveAlerts(alerts);

    logAudit('CREATE_ALERT', req.user.email, { alertId: newAlert.id, title });

    res.status(201).json(newAlert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save alert' });
  }
});

/**
 * Emergency SOS Endpoints
 */
router.get('/sos/public', (req, res) => {
  const list = getSOSRequests();
  // Return sanitized SOS list
  const sanitized = list.map((s) => ({
    id: s.id,
    timestamp: s.timestamp,
    location: s.location,
    category: s.category,
    status: s.status,
    priority: s.priority
  }));
  res.json({ requests: sanitized });
});

router.post('/sos', (req, res) => {
  try {
    const { location, latitude, longitude, category, contactName, contactPhone, message } = req.body;

    if (!location && (!latitude || !longitude)) {
      return res.status(400).json({ error: 'Geographic location or coordinates required for emergency SOS dispatch' });
    }

    const requests = getSOSRequests();
    const newSOS = {
      id: `SOS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      location: location || `Lat: ${latitude}, Lng: ${longitude}`,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      category: category || 'General Inundation / Evacuation Request',
      contactName: contactName || 'Anonymous Citizen',
      contactPhone: contactPhone || 'Not Provided',
      message: message || 'Urgent flood evacuation assistance requested.',
      status: 'Received by server',
      responderNotes: 'Queued for immediate dispatch review at District Emergency Operations Center.',
      priority: 'High'
    };

    requests.unshift(newSOS);
    saveSOSRequests(requests);

    logAudit('SOS_TRANSMITTED', contactPhone || 'Anonymous', { sosId: newSOS.id, location: newSOS.location });

    res.status(201).json({
      message: 'Emergency SOS request successfully acknowledged and logged by central operations server.',
      request: newSOS
    });
  } catch (err) {
    res.status(500).json({ error: 'Emergency SOS submission failed. Please use offline SMS or call 112 directly.' });
  }
});

router.get('/admin/sos', authenticateToken, requireRole('admin'), (req, res) => {
  const requests = getSOSRequests();
  res.json({ requests });
});

router.patch('/admin/sos/:id/status', authenticateToken, requireRole('admin'), (req, res) => {
  const { id } = req.params;
  const { status, responderNotes } = req.body;

  const requests = getSOSRequests();
  const index = requests.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'SOS record not found' });
  }

  if (status) requests[index].status = status;
  if (responderNotes) requests[index].responderNotes = responderNotes;
  requests[index].lastUpdatedBy = req.user.email;
  requests[index].lastUpdatedAt = new Date().toISOString();

  saveSOSRequests(requests);
  logAudit('UPDATE_SOS_STATUS', req.user.email, { sosId: id, newStatus: status });

  res.json({ message: 'SOS status updated', request: requests[index] });
});

/**
 * Administrator Overview & Audit Logs
 */
router.get('/admin/overview', authenticateToken, requireRole('admin'), (req, res) => {
  const sos = getSOSRequests();
  const alerts = getAlerts();
  const audit = getAuditLogs();
  const locations = getLocations();

  res.json({
    totalSOS: sos.length,
    activeSOS: sos.filter((s) => s.status !== 'Resolved').length,
    totalAlerts: alerts.length,
    monitoredLocations: locations.length,
    recentAuditLogs: audit.slice(0, 10),
    serverTelemetry: {
      uptimeSeconds: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    }
  });
});

const { generateAIResponse } = require('../utils/aiAssistant');

/**
 * AI Assistant Endpoint
 */
router.post('/ai-assistant/chat', (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }
    const response = generateAIResponse(message, context || {});
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'AI Assistant processing failed' });
  }
});

module.exports = router;
