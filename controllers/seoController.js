const axios = require('axios');
const SeoAnalyzer = require('../services/seoAnalyzer');
const KeywordExtractor = require('../services/keywordExtractor');
const UrlHelper = require('../utils/urlHelper');

class SeoController {
  static async analyzePage(req, res, next) {
    try {
      const { url } = req.body;

      if (!url || !UrlHelper.isValidUrl(url)) {
        return res.status(400).json({ success: false, error: 'Valid URL required' });
      }

      const response = await axios.get(url, { timeout: 10000 });
      const analyzer = new SeoAnalyzer();
      const result = analyzer.analyze(response.data, url);

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async extractKeywords(req, res, next) {
    try {
      const { url } = req.body;

      if (!url || !UrlHelper.isValidUrl(url)) {
        return res.status(400).json({ success: false, error: 'Valid URL required' });
      }

      const response = await axios.get(url, { timeout: 10000 });
      const text = response.data.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, ' ');

      const extractor = new KeywordExtractor();
      const keywords = extractor.extract(text);
      const phrases = extractor.extractPhrases(text);

      res.json({ success: true, data: { keywords, phrases } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SeoController;
