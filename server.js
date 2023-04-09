const app = require('./app');
const config = require('./config');
const GracefulShutdown = require('./utils/shutdown');
const ConfigValidator = require('./config/validator');

// Validate config on startup
const validation = ConfigValidator.validate(config);
if (!validation.valid) {
  console.error('Config errors:', validation.errors);
  process.exit(1);
}

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Web Crawler server running on http://localhost:${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
const shutdown = new GracefulShutdown();
shutdown
  .register('Close HTTP server', () => new Promise((resolve) => server.close(resolve)))
  .listen(server);
