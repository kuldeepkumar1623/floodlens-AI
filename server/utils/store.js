const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const SOS_FILE = path.join(__dirname, '..', '..', 'data', 'sos_requests.json');
const ALERTS_FILE = path.join(__dirname, '..', '..', 'data', 'alerts.json');
const AUDIT_FILE = path.join(__dirname, '..', '..', 'data', 'audit_logs.json');

function initDataFiles() {
  if (!fs.existsSync(SOS_FILE)) {
    fs.writeFileSync(SOS_FILE, JSON.stringify([], null, 2));
  }

  if (!fs.existsSync(ALERTS_FILE)) {
    const defaultAlerts = [
      {
        id: 'ALT-IND-01',
        title: 'Red Alert: Extremely Heavy Rainfall Warning',
        authority: 'India Meteorological Department (IMD)',
        geographicScope: 'Konkan & Goa (including Mumbai, Thane, Raigad)',
        issuedAt: new Date(Date.now() - 7200000).toISOString(),
        validUntil: new Date(Date.now() + 86400000).toISOString(),
        severity: 'Critical',
        recommendedAction: 'Stay indoors, keep emergency kits accessible, avoid low-lying underpasses and coastal walkways.',
        verified: true,
        sourceUrl: 'https://mausam.imd.gov.in'
      },
      {
        id: 'ALT-IND-02',
        title: 'Orange Advisory: Inundation Risk in Low Lying Basins',
        authority: 'Central Water Commission (CWC)',
        geographicScope: 'Chennai & South Coastal Tamil Nadu',
        issuedAt: new Date(Date.now() - 14400000).toISOString(),
        validUntil: new Date(Date.now() + 43200000).toISOString(),
        severity: 'Elevated',
        recommendedAction: 'Monitor reservoir discharge bulletins; relocate vehicles and equipment to higher ground.',
        verified: true,
        sourceUrl: 'https://cwc.gov.in'
      }
    ];
    fs.writeFileSync(ALERTS_FILE, JSON.stringify(defaultAlerts, null, 2));
  }

  if (!fs.existsSync(AUDIT_FILE)) {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify([], null, 2));
  }
}

function getSOSRequests() {
  initDataFiles();
  try {
    return JSON.parse(fs.readFileSync(SOS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveSOSRequests(list) {
  fs.writeFileSync(SOS_FILE, JSON.stringify(list, null, 2));
}

function getAlerts() {
  initDataFiles();
  try {
    return JSON.parse(fs.readFileSync(ALERTS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveAlerts(list) {
  fs.writeFileSync(ALERTS_FILE, JSON.stringify(list, null, 2));
}

function logAudit(action, actor, details) {
  initDataFiles();
  try {
    const logs = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
    logs.unshift({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      action,
      actor,
      details
    });
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs.slice(0, 100), null, 2));
  } catch (e) {
    console.error('Audit log write error:', e);
  }
}

function getAuditLogs() {
  initDataFiles();
  try {
    return JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

module.exports = {
  getSOSRequests,
  saveSOSRequests,
  getAlerts,
  saveAlerts,
  logAudit,
  getAuditLogs,
  initDataFiles
};
