class RedirectTracker {
  constructor(maxRedirects = 10) {
    this.maxRedirects = maxRedirects;
    this.chains = new Map();
  }

  track(originalUrl, redirectUrl, statusCode) {
    if (!this.chains.has(originalUrl)) {
      this.chains.set(originalUrl, []);
    }

    const chain = this.chains.get(originalUrl);
    chain.push({ from: chain.length ? chain[chain.length - 1].to : originalUrl, to: redirectUrl, statusCode, timestamp: new Date().toISOString() });

    if (chain.length > this.maxRedirects) {
      throw new Error(`Max redirects (${this.maxRedirects}) exceeded for ${originalUrl}`);
    }
  }

  getChain(url) {
    return this.chains.get(url) || [];
  }

  getFinalUrl(url) {
    const chain = this.chains.get(url);
    if (!chain || !chain.length) return url;
    return chain[chain.length - 1].to;
  }

  hasRedirect(url) {
    return this.chains.has(url) && this.chains.get(url).length > 0;
  }

  isCircular(url) {
    const chain = this.chains.get(url) || [];
    const urls = new Set([url]);
    for (const hop of chain) {
      if (urls.has(hop.to)) return true;
      urls.add(hop.to);
    }
    return false;
  }

  getAllChains() {
    const result = {};
    for (const [url, chain] of this.chains) {
      result[url] = chain;
    }
    return result;
  }

  clear() {
    this.chains.clear();
  }
}

module.exports = RedirectTracker;
