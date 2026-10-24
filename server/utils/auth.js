const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production');
}

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const USERS_FILE = path.join(__dirname, '..', '..', 'data', 'users.json');

// Create the initial admin only when explicitly configured by the operator.
function initUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = [];
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      defaultUsers.push({
        id: 'admin-01',
        name: process.env.ADMIN_NAME || 'Administrator',
        email: process.env.ADMIN_EMAIL,
        passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
        role: 'admin',
        createdAt: new Date().toISOString()
      });
    } else {
      console.warn('No initial admin configured. Set ADMIN_EMAIL and ADMIN_PASSWORD before starting the server to enable admin access.');
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }
}

function getUsers() {
  initUsers();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired authentication token' });
    }
    req.user = user;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Access denied. Requires ${role} privileges.` });
    }
    next();
  };
}

module.exports = {
  JWT_SECRET,
  getUsers,
  saveUsers,
  authenticateToken,
  requireRole,
  initUsers
};
