class ProxyManager {
  constructor(proxies = []) {
    this.proxies = proxies.map((p) => ({
      url: p,
      failures: 0,
      lastUsed: 0,
      active: true,
    }));
    this.index = 0;
  }

  addProxy(proxyUrl) {
    this.proxies.push({ url: proxyUrl, failures: 0, lastUsed: 0, active: true });
  }

  addProxies(proxyUrls) {
    proxyUrls.forEach((p) => this.addProxy(p));
  }

  getNext() {
    const active = this.proxies.filter((p) => p.active);
    if (!active.length) return null;

    const proxy = active[this.index % active.length];
    this.index++;
    proxy.lastUsed = Date.now();
    return proxy.url;
  }

  getRandom() {
    const active = this.proxies.filter((p) => p.active);
    if (!active.length) return null;
    const proxy = active[Math.floor(Math.random() * active.length)];
    proxy.lastUsed = Date.now();
    return proxy.url;
  }

  reportFailure(proxyUrl) {
    const proxy = this.proxies.find((p) => p.url === proxyUrl);
    if (proxy) {
      proxy.failures++;
      if (proxy.failures >= 3) proxy.active = false;
    }
  }

  reportSuccess(proxyUrl) {
    const proxy = this.proxies.find((p) => p.url === proxyUrl);
    if (proxy) proxy.failures = 0;
  }

  getActiveCount() {
    return this.proxies.filter((p) => p.active).length;
  }

  stats() {
    return {
      total: this.proxies.length,
      active: this.getActiveCount(),
      inactive: this.proxies.filter((p) => !p.active).length,
    };
  }

  reset() {
    this.proxies.forEach((p) => { p.failures = 0; p.active = true; });
    this.index = 0;
  }
}

module.exports = ProxyManager;
