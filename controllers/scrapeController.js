const CrawlerService = require('../services/crawlerService');
const ContentExtractor = require('../services/contentExtractor');
const UrlHelper = require('../utils/urlHelper');
const axios = require('axios');

class ScrapeController {
  static async extractContent(req, res, next) {
    try {
      const { url } = req.body;
      const fields = req.body.fields || ['article', 'meta', 'links', 'images'];

      if (!url || !UrlHelper.isValidUrl(url)) {
        return res.status(400).json({ success: false, error: 'Valid URL required' });
      }

      const response = await axios.get(url, { timeout: 10000 });
      const extractor = new ContentExtractor(response.data);
      const result = { url };

      if (fields.includes('article')) result.article = extractor.extractArticle();
      if (fields.includes('meta')) result.openGraph = extractor.extractOpenGraph();
      if (fields.includes('links')) result.links = extractor.extractEmails();
      if (fields.includes('images')) result.tables = extractor.extractTables();
      if (fields.includes('emails')) result.emails = extractor.extractEmails();
      if (fields.includes('forms')) result.forms = extractor.extractForms();

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ScrapeController;
