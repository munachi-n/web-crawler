const CrawlerService = require('../services/crawlerService');
const UrlHelper = require('../utils/urlHelper');

class CrawlerController {
  static async startCrawl(req, res, next) {
    try {
      const { url, maxDepth, maxPages } = req.body;

      if (!url || !UrlHelper.isValidUrl(url)) {
        return res.status(400).json({
          success: false,
          error: 'A valid URL is required',
        });
      }

      const crawler = new CrawlerService({
        maxDepth: maxDepth || undefined,
        maxPages: maxPages || undefined,
      });

      const results = await crawler.crawl(url);
      const stats = crawler.getStats();

      res.json({
        success: true,
        data: { stats, results },
      });
    } catch (error) {
      next(error);
    }
  }

  static async quickScrape(req, res, next) {
    try {
      const { url } = req.query;

      if (!url || !UrlHelper.isValidUrl(url)) {
        return res.status(400).json({
          success: false,
          error: 'A valid URL query parameter is required',
        });
      }

      const crawler = new CrawlerService({ maxDepth: 0, maxPages: 1 });
      const results = await crawler.crawl(url);

      res.json({
        success: true,
        data: results[0] || null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CrawlerController;
