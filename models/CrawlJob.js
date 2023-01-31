class CrawlJob {
  static STATUS = {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
  };

  constructor(data = {}) {
    this.id = data.id || CrawlJob.generateId();
    this.url = data.url;
    this.status = data.status || CrawlJob.STATUS.PENDING;
    this.options = data.options || {};
    this.results = data.results || [];
    this.stats = data.stats || null;
    this.error = data.error || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.startedAt = data.startedAt || null;
    this.completedAt = data.completedAt || null;
  }

  static generateId() {
    return `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  start() {
    this.status = CrawlJob.STATUS.RUNNING;
    this.startedAt = new Date().toISOString();
  }

  complete(results, stats) {
    this.status = CrawlJob.STATUS.COMPLETED;
    this.results = results;
    this.stats = stats;
    this.completedAt = new Date().toISOString();
  }

  fail(error) {
    this.status = CrawlJob.STATUS.FAILED;
    this.error = error;
    this.completedAt = new Date().toISOString();
  }

  cancel() {
    this.status = CrawlJob.STATUS.CANCELLED;
    this.completedAt = new Date().toISOString();
  }

  getDuration() {
    if (!this.startedAt) return null;
    const end = this.completedAt ? new Date(this.completedAt) : new Date();
    return end - new Date(this.startedAt);
  }

  toJSON() {
    return {
      id: this.id,
      url: this.url,
      status: this.status,
      options: this.options,
      stats: this.stats,
      error: this.error,
      resultCount: this.results.length,
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      duration: this.getDuration(),
    };
  }
}

module.exports = CrawlJob;
