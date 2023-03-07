const express = require('express');
const router = express.Router();
const ScrapeController = require('../controllers/scrapeController');

// POST /api/scrape/extract - Deep content extraction
router.post('/extract', ScrapeController.extractContent);

module.exports = router;
