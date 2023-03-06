const os = require('os');
const CacheService = require('../services/cacheService');

class StatusController {
  constructor(performanceMonitor) {
    this.monitor = performanceMonitor;
  }

  getStatus(req, res) {
    res.json({
      success: true,
      data: {
        status: 'running',
        uptime: this.formatUptime(process.uptime()),
        memory: this.getMemory(),
        system: this.getSystem(),
        performance: this.monitor ? this.monitor.getSummary() : null,
        timestamp: new Date().toISOString(),
      },
    });
  }

  getMemory() {
    const mem = process.memoryUsage();
    return {
      rss: this.formatBytes(mem.rss),
      heapUsed: this.formatBytes(mem.heapUsed),
      heapTotal: this.formatBytes(mem.heapTotal),
      external: this.formatBytes(mem.external),
    };
  }

  getSystem() {
    return {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      cpus: os.cpus().length,
      totalMemory: this.formatBytes(os.totalmem()),
      freeMemory: this.formatBytes(os.freemem()),
    };
  }

  formatBytes(bytes) {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  }

  formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  }
}

module.exports = StatusController;
