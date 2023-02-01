const CrawlJob = require('../models/CrawlJob');
const CrawlerService = require('../services/crawlerService');
const StorageService = require('../services/storageService');

const storage = new StorageService();

class JobController {
  static async createJob(req, res, next) {
    try {
      const { url, maxDepth, maxPages } = req.body;
      const job = new CrawlJob({ url, options: { maxDepth, maxPages } });

      storage.save('jobs', job.id, job);

      // Start crawl asynchronously
      JobController._executeCrawl(job).catch(() => {});

      res.status(201).json({ success: true, data: job.toJSON() });
    } catch (error) {
      next(error);
    }
  }

  static async getJob(req, res, next) {
    try {
      const { id } = req.params;
      const data = storage.load('jobs', id);

      if (!data) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async listJobs(req, res, next) {
    try {
      const ids = storage.list('jobs');
      const jobs = ids.map((id) => storage.load('jobs', id)).filter(Boolean);

      res.json({ success: true, data: jobs, total: jobs.length });
    } catch (error) {
      next(error);
    }
  }

  static async _executeCrawl(job) {
    job.start();
    storage.save('jobs', job.id, job);

    try {
      const crawler = new CrawlerService(job.options);
      const results = await crawler.crawl(job.url);
      const stats = crawler.getStats();
      job.complete(results, stats);
    } catch (error) {
      job.fail(error.message);
    }

    storage.save('jobs', job.id, job);
  }
}

module.exports = JobController;
