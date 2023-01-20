const UrlHelper = require('../utils/urlHelper');

class Validator {
  static crawlRequest(req, res, next) {
    const { url, maxDepth, maxPages } = req.body;
    const errors = [];

    if (!url) {
      errors.push('URL is required');
    } else if (!UrlHelper.isValidUrl(url)) {
      errors.push('Invalid URL format. Must start with http:// or https://');
    }

    if (maxDepth !== undefined) {
      const depth = parseInt(maxDepth);
      if (isNaN(depth) || depth < 0 || depth > 10) {
        errors.push('maxDepth must be a number between 0 and 10');
      }
    }

    if (maxPages !== undefined) {
      const pages = parseInt(maxPages);
      if (isNaN(pages) || pages < 1 || pages > 500) {
        errors.push('maxPages must be a number between 1 and 500');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    next();
  }

  static scrapeRequest(req, res, next) {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL query parameter is required' });
    }

    if (!UrlHelper.isValidUrl(url)) {
      return res.status(400).json({ success: false, error: 'Invalid URL format' });
    }

    next();
  }
}

module.exports = Validator;
