const express = require('express');
const router = express.Router();
const SeoController = require('../controllers/seoController');

// POST /api/seo/analyze - Analyze page SEO
router.post('/analyze', SeoController.analyzePage);

// POST /api/seo/keywords - Extract keywords
router.post('/keywords', SeoController.extractKeywords);

module.exports = router;
