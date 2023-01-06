const express = require('express');
const router = express.Router();
const CrawlerController = require('../controllers/crawlerController');

// POST /api/crawler/crawl - Start a full crawl
router.post('/crawl', CrawlerController.startCrawl);

// GET /api/crawler/scrape?url=... - Quick single-page scrape
router.get('/scrape', CrawlerController.quickScrape);

module.exports = router;
