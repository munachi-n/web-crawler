const axios = require('axios');

class RobotsParser {
  constructor() {
    this.rules = {};
    this.sitemaps = [];
    this.crawlDelay = null;
  }

  async fetch(baseUrl) {
    try {
      const url = new URL('/robots.txt', baseUrl).href;
      const response = await axios.get(url, { timeout: 5000 });
      this.parse(response.data);
      return true;
    } catch {
      return false;
    }
  }

  parse(content) {
    let currentAgent = '*';
    const lines = content.split('\n');

    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;

      const [directive, ...rest] = line.split(':');
      const value = rest.join(':').trim();

      switch (directive.toLowerCase()) {
        case 'user-agent':
          currentAgent = value;
          if (!this.rules[currentAgent]) {
            this.rules[currentAgent] = { allow: [], disallow: [] };
          }
          break;
        case 'disallow':
          if (!this.rules[currentAgent]) this.rules[currentAgent] = { allow: [], disallow: [] };
          if (value) this.rules[currentAgent].disallow.push(value);
          break;
        case 'allow':
          if (!this.rules[currentAgent]) this.rules[currentAgent] = { allow: [], disallow: [] };
          if (value) this.rules[currentAgent].allow.push(value);
          break;
        case 'sitemap':
          this.sitemaps.push(value);
          break;
        case 'crawl-delay':
          this.crawlDelay = parseInt(value) || null;
          break;
      }
    }
  }

  isAllowed(path, agent = '*') {
    const agentRules = this.rules[agent] || this.rules['*'];
    if (!agentRules) return true;

    for (const allowed of agentRules.allow) {
      if (path.startsWith(allowed)) return true;
    }

    for (const disallowed of agentRules.disallow) {
      if (path.startsWith(disallowed)) return false;
    }

    return true;
  }

  getSitemaps() {
    return this.sitemaps;
  }

  getCrawlDelay() {
    return this.crawlDelay;
  }
}

module.exports = RobotsParser;
