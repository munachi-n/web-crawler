class ApiDocsController {
  static getDocs(req, res) {
    const docs = {
      name: 'Web Crawler API',
      version: '1.0.0',
      endpoints: [
        {
          method: 'POST',
          path: '/api/crawler/crawl',
          description: 'Start a synchronous crawl',
          body: { url: 'string (required)', maxDepth: 'number (0-10)', maxPages: 'number (1-500)' },
        },
        {
          method: 'GET',
          path: '/api/crawler/scrape',
          description: 'Quick single-page scrape',
          query: { url: 'string (required)' },
        },
        {
          method: 'POST',
          path: '/api/jobs',
          description: 'Create an async crawl job',
          body: { url: 'string (required)', maxDepth: 'number', maxPages: 'number' },
        },
        {
          method: 'GET',
          path: '/api/jobs',
          description: 'List all crawl jobs',
        },
        {
          method: 'GET',
          path: '/api/jobs/:id',
          description: 'Get a specific job by ID',
        },
        {
          method: 'GET',
          path: '/api/export/:id',
          description: 'Export job results',
          query: { format: 'json | csv | html' },
        },
        {
          method: 'GET',
          path: '/health',
          description: 'Health check endpoint',
        },
        {
          method: 'GET',
          path: '/api/docs',
          description: 'This documentation',
        },
      ],
    };

    res.json(docs);
  }
}

module.exports = ApiDocsController;
