class ApiDocsController {
  static getDocs(req, res) {
    const docs = {
      name: 'Web Crawler API',
      version: '1.0.0',
      description: 'An open source web crawler built with Node.js, Express, and Cheerio',
      baseUrl: `${req.protocol}://${req.get('host')}`,
      endpoints: [
        { method: 'POST', path: '/api/crawler/crawl', description: 'Start a synchronous crawl', body: { url: 'string (required)', maxDepth: 'number (0-10)', maxPages: 'number (1-500)' } },
        { method: 'GET', path: '/api/crawler/scrape', description: 'Quick single-page scrape', query: { url: 'string (required)' } },
        { method: 'POST', path: '/api/jobs', description: 'Create an async crawl job', body: { url: 'string (required)', maxDepth: 'number', maxPages: 'number' } },
        { method: 'GET', path: '/api/jobs', description: 'List all crawl jobs' },
        { method: 'GET', path: '/api/jobs/:id', description: 'Get a specific job by ID' },
        { method: 'GET', path: '/api/export/:id', description: 'Export job results', query: { format: 'json | csv | html' } },
        { method: 'POST', path: '/api/scrape/extract', description: 'Deep content extraction', body: { url: 'string (required)', fields: 'array (article, meta, links, images, emails, forms)' } },
        { method: 'POST', path: '/api/seo/analyze', description: 'Analyze page SEO', body: { url: 'string (required)' } },
        { method: 'POST', path: '/api/seo/keywords', description: 'Extract keywords from page', body: { url: 'string (required)' } },
        { method: 'GET', path: '/health', description: 'Health check endpoint' },
        { method: 'GET', path: '/api/docs', description: 'This documentation' },
      ],
      authentication: 'Optional API key via x-api-key header or apiKey query param',
      rateLimit: '30 requests per minute per IP',
    };

    res.json(docs);
  }
}

module.exports = ApiDocsController;
