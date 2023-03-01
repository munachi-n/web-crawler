class ResponseAnalyzer {
  analyze(response) {
    return {
      statusCode: response.status,
      statusText: response.statusText,
      contentType: this.getContentType(response),
      contentLength: this.getContentLength(response),
      isHtml: this.isHtml(response),
      isRedirect: this.isRedirect(response),
      encoding: this.getEncoding(response),
      server: response.headers?.['server'] || null,
      cacheControl: response.headers?.['cache-control'] || null,
      lastModified: response.headers?.['last-modified'] || null,
      etag: response.headers?.['etag'] || null,
    };
  }

  getContentType(response) {
    const ct = response.headers?.['content-type'] || '';
    return ct.split(';')[0].trim();
  }

  getContentLength(response) {
    return parseInt(response.headers?.['content-length']) || null;
  }

  getEncoding(response) {
    const ct = response.headers?.['content-type'] || '';
    const match = ct.match(/charset=([^\s;]+)/i);
    return match ? match[1] : 'utf-8';
  }

  isHtml(response) {
    return this.getContentType(response).includes('text/html');
  }

  isRedirect(response) {
    return response.status >= 300 && response.status < 400;
  }

  isSuccess(response) {
    return response.status >= 200 && response.status < 300;
  }

  isClientError(response) {
    return response.status >= 400 && response.status < 500;
  }

  isServerError(response) {
    return response.status >= 500;
  }
}

module.exports = ResponseAnalyzer;
