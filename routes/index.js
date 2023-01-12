const express = require('express');
const router = express.Router();
const crawlerRoutes = require('./crawlerRoutes');
const viewRoutes = require('./viewRoutes');

// View routes
router.use('/', viewRoutes);

// API routes
router.use('/api/crawler', crawlerRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
