const axios = require('axios');
const cheerio = require('cheerio');

class SitemapParser {
  constructor() {
    this.urls = [];
  }

  async fetch(sitemapUrl) {
    try {
      const response = await axios.get(sitemapUrl, { timeout: 10000 });
      this.parse(response.data);
      return this.urls;
    } catch (error) {
      throw new Error(`Failed to fetch sitemap: ${error.message}`);
    }
  }

  parse(xmlContent) {
    const $ = cheerio.load(xmlContent, { xmlMode: true });

    $('url').each((_, element) => {
      const loc = $(element).find('loc').text();
      const lastmod = $(element).find('lastmod').text() || null;
      const changefreq = $(element).find('changefreq').text() || null;
      const priority = $(element).find('priority').text() || null;

      if (loc) {
        this.urls.push({
          loc,
          lastmod,
          changefreq,
          priority: priority ? parseFloat(priority) : null,
        });
      }
    });

    // Handle sitemap index files
    $('sitemap').each((_, element) => {
      const loc = $(element).find('loc').text();
      if (loc) {
        this.urls.push({ loc, type: 'sitemap-index' });
      }
    });
  }

  getUrls() {
    return this.urls.filter((u) => u.type !== 'sitemap-index');
  }

  getSubSitemaps() {
    return this.urls.filter((u) => u.type === 'sitemap-index');
  }

  reset() {
    this.urls = [];
  }
}

module.exports = SitemapParser;
