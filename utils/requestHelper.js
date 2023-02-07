const axios = require('axios');

class RequestHelper {
  constructor(options = {}) {
    this.timeout = options.timeout || 10000;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.headers = options.headers || {};
  }

  async get(url, options = {}) {
    return this._requestWithRetry('GET', url, options);
  }

  async post(url, data, options = {}) {
    return this._requestWithRetry('POST', url, { ...options, data });
  }

  async _requestWithRetry(method, url, options, attempt = 1) {
    try {
      const response = await axios({
        method,
        url,
        timeout: this.timeout,
        headers: { ...this.headers, ...options.headers },
        data: options.data,
        maxRedirects: options.maxRedirects || 5,
        validateStatus: (status) => status < 500,
      });

      return {
        status: response.status,
        headers: response.headers,
        data: response.data,
        url: response.config.url,
        redirected: response.request?.res?.responseUrl !== url,
      };
    } catch (error) {
      if (attempt < this.maxRetries && this._isRetryable(error)) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await this._sleep(delay);
        return this._requestWithRetry(method, url, options, attempt + 1);
      }
      throw error;
    }
  }

  _isRetryable(error) {
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') return true;
    if (error.response && error.response.status >= 500) return true;
    return false;
  }

  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = RequestHelper;
