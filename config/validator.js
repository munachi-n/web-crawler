class ConfigValidator {
  static validate(config) {
    const errors = [];

    if (!config.port || config.port < 1 || config.port > 65535) {
      errors.push('Port must be between 1 and 65535');
    }

    if (config.crawler) {
      const c = config.crawler;
      if (c.maxDepth < 0 || c.maxDepth > 20) errors.push('crawler.maxDepth must be 0-20');
      if (c.maxPages < 1 || c.maxPages > 10000) errors.push('crawler.maxPages must be 1-10000');
      if (c.requestDelay < 0) errors.push('crawler.requestDelay must be non-negative');
      if (c.timeout < 1000) errors.push('crawler.timeout must be at least 1000ms');
      if (c.concurrency < 1 || c.concurrency > 20) errors.push('crawler.concurrency must be 1-20');
    }

    if (config.cache) {
      if (config.cache.ttl < 0) errors.push('cache.ttl must be non-negative');
      if (config.cache.maxSize < 1) errors.push('cache.maxSize must be at least 1');
    }

    if (config.rateLimit) {
      if (config.rateLimit.windowMs < 1000) errors.push('rateLimit.windowMs must be at least 1000');
      if (config.rateLimit.maxRequests < 1) errors.push('rateLimit.maxRequests must be at least 1');
    }

    return { valid: errors.length === 0, errors };
  }

  static validateOrThrow(config) {
    const result = this.validate(config);
    if (!result.valid) {
      throw new Error(`Invalid config: ${result.errors.join(', ')}`);
    }
    return true;
  }
}

module.exports = ConfigValidator;
