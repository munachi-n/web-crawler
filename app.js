const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const RateLimiter = require('./middlewares/rateLimiter');
const PerformanceMonitor = require('./middlewares/performanceMonitor');

const app = express();

// Performance monitoring
const perfMonitor = new PerformanceMonitor();
app.use(perfMonitor.middleware());

// Rate limiting
const limiter = new RateLimiter({
  windowMs: config.rateLimit.windowMs,
  maxRequests: config.rateLimit.maxRequests,
});
app.use('/api', limiter.middleware());

// Standard middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Expose for status endpoint
app.locals.perfMonitor = perfMonitor;

module.exports = app;
