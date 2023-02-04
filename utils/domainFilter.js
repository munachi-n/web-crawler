class DomainFilter {
  constructor(options = {}) {
    this.allowList = new Set(options.allow || []);
    this.blockList = new Set(options.block || []);
    this.sameDomainOnly = options.sameDomainOnly || false;
    this.baseDomain = options.baseDomain || null;
  }

  isAllowed(url) {
    try {
      const hostname = new URL(url).hostname;

      if (this.blockList.size > 0 && this._matchesList(hostname, this.blockList)) {
        return false;
      }

      if (this.allowList.size > 0 && !this._matchesList(hostname, this.allowList)) {
        return false;
      }

      if (this.sameDomainOnly && this.baseDomain) {
        return this._getRootDomain(hostname) === this._getRootDomain(this.baseDomain);
      }

      return true;
    } catch {
      return false;
    }
  }

  _matchesList(hostname, list) {
    for (const domain of list) {
      if (hostname === domain || hostname.endsWith(`.${domain}`)) {
        return true;
      }
    }
    return false;
  }

  _getRootDomain(hostname) {
    const parts = hostname.split('.');
    return parts.slice(-2).join('.');
  }

  addToAllowList(domain) { this.allowList.add(domain); }
  addToBlockList(domain) { this.blockList.add(domain); }
  removeFromAllowList(domain) { this.allowList.delete(domain); }
  removeFromBlockList(domain) { this.blockList.delete(domain); }
}

module.exports = DomainFilter;
