class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.maxMetrics = 1000;
  }

  middleware() {
    return (req, res, next) => {
      const start = process.hrtime.bigint();

      res.on('finish', () => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1e6;

        const metric = {
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          duration: Math.round(durationMs * 100) / 100,
          timestamp: new Date().toISOString(),
        };

        this.metrics.push(metric);
        if (this.metrics.length > this.maxMetrics) {
          this.metrics.shift();
        }
      });

      next();
    };
  }

  getMetrics() {
    return this.metrics;
  }

  getSummary() {
    if (!this.metrics.length) return null;

    const durations = this.metrics.map((m) => m.duration);
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;

    return {
      totalRequests: this.metrics.length,
      avgDuration: Math.round(avg * 100) / 100,
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations),
      statusCodes: this.metrics.reduce((acc, m) => {
        acc[m.statusCode] = (acc[m.statusCode] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  clear() {
    this.metrics = [];
  }
}

module.exports = PerformanceMonitor;
