const express = require('express');
const router = express.Router();

// Route files will be imported here as they are created
// e.g. const crawlerRoutes = require('./crawlerRoutes');

// Mount routes
// router.use('/api/crawler', crawlerRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
