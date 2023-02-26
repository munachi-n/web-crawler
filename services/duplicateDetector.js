const crypto = require('crypto');

class DuplicateDetector {
  constructor() {
    this.urlHashes = new Set();
    this.contentHashes = new Set();
  }

  isUrlSeen(url) {
    const hash = this._hash(this._normalizeUrl(url));
    if (this.urlHashes.has(hash)) return true;
    this.urlHashes.add(hash);
    return false;
  }

  isContentDuplicate(content) {
    const hash = this._hash(content);
    if (this.contentHashes.has(hash)) return true;
    this.contentHashes.add(hash);
    return false;
  }

  _normalizeUrl(url) {
    try {
      const u = new URL(url);
      u.hash = '';
      const params = new URLSearchParams(u.searchParams);
      params.sort();
      u.search = params.toString();
      let normalized = u.href.toLowerCase();
      if (normalized.endsWith('/')) normalized = normalized.slice(0, -1);
      return normalized;
    } catch {
      return url;
    }
  }

  _hash(str) {
    return crypto.createHash('md5').update(str).digest('hex');
  }

  getStats() {
    return {
      uniqueUrls: this.urlHashes.size,
      uniqueContent: this.contentHashes.size,
    };
  }

  reset() {
    this.urlHashes.clear();
    this.contentHashes.clear();
  }
}

module.exports = DuplicateDetector;
