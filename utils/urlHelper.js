const { URL } = require('url');

class UrlHelper {
  static isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  static normalizeUrl(urlString) {
    try {
      const url = new URL(urlString);
      url.hash = '';
      let normalized = url.href;
      if (normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
      }
      return normalized;
    } catch {
      return null;
    }
  }

  static getDomain(urlString) {
    try {
      const url = new URL(urlString);
      return url.hostname;
    } catch {
      return null;
    }
  }

  static isSameDomain(url1, url2) {
    return this.getDomain(url1) === this.getDomain(url2);
  }

  static resolveRelative(base, relative) {
    try {
      return new URL(relative, base).href;
    } catch {
      return null;
    }
  }

  static getPathDepth(urlString) {
    try {
      const url = new URL(urlString);
      const segments = url.pathname.split('/').filter(Boolean);
      return segments.length;
    } catch {
      return -1;
    }
  }
}

module.exports = UrlHelper;
