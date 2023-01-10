const cheerio = require('cheerio');

class HtmlParser {
  constructor(html) {
    this.$ = cheerio.load(html);
  }

  getTitle() {
    return this.$.root().find('title').text().trim();
  }

  getMetaTags() {
    const meta = {};
    this.$('meta').each((_, el) => {
      const name = this.$(el).attr('name') || this.$(el).attr('property');
      const content = this.$(el).attr('content');
      if (name && content) {
        meta[name] = content;
      }
    });
    return meta;
  }

  getHeadings() {
    const headings = {};
    for (let level = 1; level <= 6; level++) {
      const tag = `h${level}`;
      const found = [];
      this.$(tag).each((_, el) => {
        found.push(this.$(el).text().trim());
      });
      if (found.length > 0) {
        headings[tag] = found;
      }
    }
    return headings;
  }

  getLinks() {
    const links = [];
    this.$('a[href]').each((_, el) => {
      links.push({
        href: this.$(el).attr('href'),
        text: this.$(el).text().trim(),
        rel: this.$(el).attr('rel') || null,
      });
    });
    return links;
  }

  getImages() {
    const images = [];
    this.$('img').each((_, el) => {
      images.push({
        src: this.$(el).attr('src'),
        alt: this.$(el).attr('alt') || '',
        width: this.$(el).attr('width') || null,
        height: this.$(el).attr('height') || null,
      });
    });
    return images;
  }

  getTextContent() {
    this.$('script, style, noscript').remove();
    return this.$('body').text().replace(/\s+/g, ' ').trim();
  }

  getStructuredData() {
    const scripts = [];
    this.$('script[type="application/ld+json"]').each((_, el) => {
      try {
        scripts.push(JSON.parse(this.$(el).html()));
      } catch (e) {
        // skip invalid JSON-LD
      }
    });
    return scripts;
  }
}

module.exports = HtmlParser;
