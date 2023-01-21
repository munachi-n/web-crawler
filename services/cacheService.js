class CacheService {
  constructor(options = {}) {
    this.ttl = options.ttl || 5 * 60 * 1000;
    this.maxSize = options.maxSize || 200;
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    entry.hits++;
    return entry.value;
  }

  set(key, value, ttl) {
    if (this.store.size >= this.maxSize) {
      this._evict();
    }

    this.store.set(key, {
      value,
      createdAt: Date.now(),
      expiresAt: Date.now() + (ttl || this.ttl),
      hits: 0,
    });
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  size() {
    return this.store.size;
  }

  stats() {
    let totalHits = 0;
    let expired = 0;
    const now = Date.now();

    for (const [, entry] of this.store) {
      totalHits += entry.hits;
      if (now > entry.expiresAt) expired++;
    }

    return { size: this.store.size, totalHits, expired };
  }

  _evict() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.store) {
      if (entry.createdAt < oldestTime) {
        oldestTime = entry.createdAt;
        oldestKey = key;
      }
    }

    if (oldestKey) this.store.delete(oldestKey);
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

module.exports = CacheService;
