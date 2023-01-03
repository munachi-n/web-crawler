const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config');

class CrawlerService {
  constructor(options = {}) {
    this.maxDepth = options.maxDepth || config.crawler.maxDepth;
    this.maxPages = options.maxPages || config.crawler.maxPages;
    this.delay = options.delay || config.crawler.requestDelay;
    this.userAgent = options.userAgent || config.crawler.userAgent;
    this.visited = new Set();
    this.results = [];
  }

  async crawl(startUrl, depth = 0) {
    if (depth > this.maxDepth || this.visited.size >= this.maxPages) {
      return this.results;
    }

    if (this.visited.has(startUrl)) {
      return this.results;
    }

    this.visited.add(startUrl);

    try {
      const response = await this.fetchPage(startUrl);
      const $ = cheerio.load(response.data);
      const pageData = this.extractPageData($, startUrl);
      this.results.push(pageData);

      const links = this.extractLinks($, startUrl);

      for (const link of links) {
        if (this.visited.size >= this.maxPages) break;
        await this.sleep(this.delay);
        await this.crawl(link, depth + 1);
      }
    } catch (error) {
      this.results.push({
        url: startUrl,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    return this.results;
  }

  async fetchPage(url) {
    return axios.get(url, {
      headers: { 'User-Agent': this.userAgent },
      timeout: 10000,
    });
  }

  extractPageData($, url) {
    return {
      url,
      title: $('title').text().trim(),
      metaDescription: $('meta[name="description"]').attr('content') || '',
      h1: $('h1').first().text().trim(),
      linkCount: $('a[href]').length,
      imageCount: $('img').length,
      timestamp: new Date().toISOString(),
    };
  }

  extractLinks($, baseUrl) {
    const links = [];
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      try {
        const absoluteUrl = new URL(href, baseUrl).href;
        if (absoluteUrl.startsWith('http') && !this.visited.has(absoluteUrl)) {
          links.push(absoluteUrl);
        }
      } catch (e) {
        // skip invalid URLs
      }
    });
    return [...new Set(links)];
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getStats() {
    return {
      pagesVisited: this.visited.size,
      resultsCollected: this.results.length,
      errors: this.results.filter((r) => r.error).length,
    };
  }

  reset() {
    this.visited.clear();
    this.results = [];
  }
}

module.exports = CrawlerService;
