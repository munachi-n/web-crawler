require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  crawler: {
    maxDepth: parseInt(process.env.CRAWLER_MAX_DEPTH) || 3,
    maxPages: parseInt(process.env.CRAWLER_MAX_PAGES) || 100,
    requestDelay: parseInt(process.env.CRAWLER_REQUEST_DELAY) || 1000,
    userAgent: process.env.CRAWLER_USER_AGENT || 'WebCrawlerBot/1.0',
  },
};
