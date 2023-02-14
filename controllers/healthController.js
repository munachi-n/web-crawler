const os = require('os');

class HealthController {
  static check(req, res) {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      },
      system: {
        platform: os.platform(),
        cpus: os.cpus().length,
        freeMemory: Math.round(os.freemem() / 1024 / 1024) + ' MB',
        loadAvg: os.loadavg(),
      },
    });
  }

  static readiness(req, res) {
    res.json({ ready: true, timestamp: new Date().toISOString() });
  }

  static liveness(req, res) {
    res.json({ alive: true, pid: process.pid });
  }
}

module.exports = HealthController;
