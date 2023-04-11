const CrawlerService = require('./crawlerService');
const CacheService = require('./cacheService');
const QueueService = require('./queueService');
const StorageService = require('./storageService');
const RobotsParser = require('./robotsParser');
const SitemapParser = require('./sitemapParser');
const ContentExtractor = require('./contentExtractor');
const DuplicateDetector = require('./duplicateDetector');
const Scheduler = require('./scheduler');
const ResponseAnalyzer = require('./responseAnalyzer');
const ReportGenerator = require('./reportGenerator');
const RedirectTracker = require('./redirectTracker');
const LinkGraph = require('./linkGraph');
const SeoAnalyzer = require('./seoAnalyzer');
const KeywordExtractor = require('./keywordExtractor');
const CrawlStateManager = require('./crawlStateManager');

module.exports = {
  CrawlerService,
  CacheService,
  QueueService,
  StorageService,
  RobotsParser,
  SitemapParser,
  ContentExtractor,
  DuplicateDetector,
  Scheduler,
  ResponseAnalyzer,
  ReportGenerator,
  RedirectTracker,
  LinkGraph,
  SeoAnalyzer,
  KeywordExtractor,
  CrawlStateManager,
};
