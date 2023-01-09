class CrawlResult {
  constructor(data = {}) {
    this.id = data.id || CrawlResult.generateId();
    this.url = data.url || '';
    this.title = data.title || '';
    this.metaDescription = data.metaDescription || '';
    this.h1 = data.h1 || '';
    this.linkCount = data.linkCount || 0;
    this.imageCount = data.imageCount || 0;
    this.error = data.error || null;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.depth = data.depth || 0;
    this.statusCode = data.statusCode || null;
    this.contentLength = data.contentLength || 0;
  }

  static generateId() {
    return `crawl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  hasError() {
    return this.error !== null;
  }

  toJSON() {
    return {
      id: this.id,
      url: this.url,
      title: this.title,
      metaDescription: this.metaDescription,
      h1: this.h1,
      linkCount: this.linkCount,
      imageCount: this.imageCount,
      error: this.error,
      timestamp: this.timestamp,
      depth: this.depth,
      statusCode: this.statusCode,
      contentLength: this.contentLength,
    };
  }

  static fromCrawlerData(data) {
    return new CrawlResult(data);
  }
}

module.exports = CrawlResult;
