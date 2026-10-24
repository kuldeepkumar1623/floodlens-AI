const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const { loadAllData } = require('./utils/dataLoader');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Serve built frontend assets directly from server
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

// Catch-all to serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Load data before starting
loadAllData()
  .then(({ rainfall, floodHistory, validationErrors }) => {
    console.log(`Loaded ${rainfall.length} rainfall records`);
    console.log(`Loaded ${floodHistory.length} flood history records`);
    if (validationErrors.length > 0) {
      console.warn(`${validationErrors.length} validation warnings`);
    }
    
    app.listen(PORT, () => {
      console.log(`FloodLens unified server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to load data:', err.message);
    app.listen(PORT, () => {
      console.log(`FloodLens unified server running on http://localhost:${PORT} (with data errors)`);
    });
  });
