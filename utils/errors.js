class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

class RateLimitError extends AppError {
  constructor(retryAfter = 60) {
    super('Too many requests', 429);
    this.retryAfter = retryAfter;
  }
}

class CrawlError extends AppError {
  constructor(url, reason) {
    super(`Crawl failed for ${url}: ${reason}`, 502);
    this.url = url;
    this.reason = reason;
  }
}

class TimeoutError extends AppError {
  constructor(url, timeoutMs) {
    super(`Request to ${url} timed out after ${timeoutMs}ms`, 504);
    this.url = url;
    this.timeoutMs = timeoutMs;
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  CrawlError,
  TimeoutError,
};
