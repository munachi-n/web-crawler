const cheerio = require('cheerio');

class SeoAnalyzer {
  analyze(html, url) {
    const $ = cheerio.load(html);
    const issues = [];

    const title = $('title').text().trim();
    if (!title) issues.push({ type: 'error', rule: 'missing-title', message: 'Page has no title tag' });
    else if (title.length > 60) issues.push({ type: 'warning', rule: 'title-length', message: `Title too long (${title.length} chars, max 60)` });
    else if (title.length < 10) issues.push({ type: 'warning', rule: 'title-length', message: `Title too short (${title.length} chars, min 10)` });

    const metaDesc = $('meta[name="description"]').attr('content') || '';
    if (!metaDesc) issues.push({ type: 'error', rule: 'missing-meta-description', message: 'Page has no meta description' });
    else if (metaDesc.length > 160) issues.push({ type: 'warning', rule: 'meta-description-length', message: `Meta description too long (${metaDesc.length} chars, max 160)` });

    const h1s = $('h1');
    if (h1s.length === 0) issues.push({ type: 'error', rule: 'missing-h1', message: 'Page has no H1 tag' });
    else if (h1s.length > 1) issues.push({ type: 'warning', rule: 'multiple-h1', message: `Page has ${h1s.length} H1 tags (should have 1)` });

    const imgsWithoutAlt = $('img:not([alt]), img[alt=""]');
    if (imgsWithoutAlt.length > 0) {
      issues.push({ type: 'warning', rule: 'img-alt', message: `${imgsWithoutAlt.length} images missing alt text` });
    }

    const canonical = $('link[rel="canonical"]').attr('href');
    if (!canonical) issues.push({ type: 'info', rule: 'missing-canonical', message: 'No canonical URL specified' });

    const viewport = $('meta[name="viewport"]').attr('content');
    if (!viewport) issues.push({ type: 'warning', rule: 'missing-viewport', message: 'No viewport meta tag' });

    const robots = $('meta[name="robots"]').attr('content') || '';
    const hasNoindex = robots.toLowerCase().includes('noindex');

    return {
      url,
      title: { text: title, length: title.length },
      metaDescription: { text: metaDesc, length: metaDesc.length },
      h1Count: h1s.length,
      imageCount: $('img').length,
      imagesWithoutAlt: imgsWithoutAlt.length,
      canonical,
      hasViewport: !!viewport,
      noindex: hasNoindex,
      issues,
      score: this.calculateScore(issues),
    };
  }

  calculateScore(issues) {
    let score = 100;
    issues.forEach((i) => {
      if (i.type === 'error') score -= 15;
      else if (i.type === 'warning') score -= 5;
      else if (i.type === 'info') score -= 1;
    });
    return Math.max(0, score);
  }
}

module.exports = SeoAnalyzer;
