class GracefulShutdown {
  constructor() {
    this.handlers = [];
    this.shuttingDown = false;
  }

  register(name, handler) {
    this.handlers.push({ name, handler });
    return this;
  }

  listen(server) {
    const shutdown = async (signal) => {
      if (this.shuttingDown) return;
      this.shuttingDown = true;

      console.log(`\n[Shutdown] Received ${signal}, starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(() => {
        console.log('[Shutdown] HTTP server closed');
      });

      // Run cleanup handlers
      for (const { name, handler } of this.handlers) {
        try {
          console.log(`[Shutdown] Running: ${name}...`);
          await handler();
          console.log(`[Shutdown] Completed: ${name}`);
        } catch (error) {
          console.error(`[Shutdown] Error in ${name}:`, error.message);
        }
      }

      console.log('[Shutdown] Cleanup complete. Exiting.');
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      console.error('[Fatal] Uncaught exception:', error);
      shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason) => {
      console.error('[Fatal] Unhandled rejection:', reason);
    });

    return this;
  }
}

module.exports = GracefulShutdown;
