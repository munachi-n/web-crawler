const express = require('express');
const router = express.Router();
const crawlerRoutes = require('./crawlerRoutes');
const jobRoutes = require('./jobRoutes');
const exportRoutes = require('./exportRoutes');
const apiDocsRoutes = require('./apiDocsRoutes');
const viewRoutes = require('./viewRoutes');

// View routes
router.use('/', viewRoutes);

// API routes
router.use('/api/crawler', crawlerRoutes);
router.use('/api/jobs', jobRoutes);
router.use('/api/export', exportRoutes);
router.use('/api/docs', apiDocsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
