const cheerio = require('cheerio');

class ContentExtractor {
  constructor(html) {
    this.$ = cheerio.load(html);
  }

  extractArticle() {
    const selectors = ['article', '[role="main"]', '.post-content', '.entry-content', '.article-body', 'main'];

    for (const selector of selectors) {
      const el = this.$(selector).first();
      if (el.length) {
        return {
          html: el.html(),
          text: el.text().replace(/\s+/g, ' ').trim(),
          selector,
        };
      }
    }

    return { html: this.$('body').html(), text: this.$('body').text().replace(/\s+/g, ' ').trim(), selector: 'body' };
  }

  extractEmails() {
    const text = this.$('body').html() || '';
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return [...new Set(text.match(emailRegex) || [])];
  }

  extractPhoneNumbers() {
    const text = this.$('body').text() || '';
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
    return [...new Set(text.match(phoneRegex) || [])];
  }

  extractOpenGraph() {
    const og = {};
    this.$('meta[property^="og:"]').each((_, el) => {
      const property = this.$(el).attr('property').replace('og:', '');
      og[property] = this.$(el).attr('content');
    });
    return og;
  }

  extractTables() {
    const tables = [];
    this.$('table').each((_, table) => {
      const rows = [];
      this.$(table).find('tr').each((_, tr) => {
        const cells = [];
        this.$(tr).find('td, th').each((_, cell) => {
          cells.push(this.$(cell).text().trim());
        });
        if (cells.length) rows.push(cells);
      });
      if (rows.length) tables.push(rows);
    });
    return tables;
  }

  extractForms() {
    const forms = [];
    this.$('form').each((_, form) => {
      const fields = [];
      this.$(form).find('input, select, textarea').each((_, field) => {
        fields.push({
          type: this.$(field).attr('type') || field.tagName,
          name: this.$(field).attr('name') || null,
          id: this.$(field).attr('id') || null,
        });
      });
      forms.push({
        action: this.$(form).attr('action') || null,
        method: this.$(form).attr('method') || 'GET',
        fields,
      });
    });
    return forms;
  }
}

module.exports = ContentExtractor;
