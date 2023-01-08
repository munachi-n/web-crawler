class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60 * 1000;
    this.maxRequests = options.maxRequests || 30;
    this.clients = new Map();
  }

  middleware() {
    return (req, res, next) => {
      const clientIp = req.ip || req.connection.remoteAddress;
      const now = Date.now();

      if (!this.clients.has(clientIp)) {
        this.clients.set(clientIp, { count: 1, windowStart: now });
        return next();
      }

      const client = this.clients.get(clientIp);

      if (now - client.windowStart > this.windowMs) {
        client.count = 1;
        client.windowStart = now;
        return next();
      }

      if (client.count >= this.maxRequests) {
        const retryAfter = Math.ceil((client.windowStart + this.windowMs - now) / 1000);
        res.set('Retry-After', String(retryAfter));
        return res.status(429).json({
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter,
        });
      }

      client.count++;
      next();
    };
  }

  cleanup() {
    const now = Date.now();
    for (const [ip, client] of this.clients.entries()) {
      if (now - client.windowStart > this.windowMs) {
        this.clients.delete(ip);
      }
    }
  }
}

module.exports = RateLimiter;
