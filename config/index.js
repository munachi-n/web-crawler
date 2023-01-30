require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiKey: process.env.API_KEY || null,
  crawler: {
    maxDepth: parseInt(process.env.CRAWLER_MAX_DEPTH) || 3,
    maxPages: parseInt(process.env.CRAWLER_MAX_PAGES) || 100,
    requestDelay: parseInt(process.env.CRAWLER_REQUEST_DELAY) || 1000,
    userAgent: process.env.CRAWLER_USER_AGENT || 'WebCrawlerBot/1.0',
    respectRobotsTxt: process.env.CRAWLER_RESPECT_ROBOTS !== 'false',
    timeout: parseInt(process.env.CRAWLER_TIMEOUT) || 10000,
    concurrency: parseInt(process.env.CRAWLER_CONCURRENCY) || 3,
  },
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    ttl: parseInt(process.env.CACHE_TTL) || 300000,
    maxSize: parseInt(process.env.CACHE_MAX_SIZE) || 200,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX) || 30,
  },
  storage: {
    dataDir: process.env.STORAGE_DIR || './data',
  },
};
