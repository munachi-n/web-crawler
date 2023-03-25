class HeaderAnalyzer {
  analyze(headers) {
    return {
      security: this.checkSecurity(headers),
      caching: this.checkCaching(headers),
      server: this.getServerInfo(headers),
      cookies: this.countCookies(headers),
    };
  }

  checkSecurity(headers) {
    const findings = [];

    if (!headers['strict-transport-security']) {
      findings.push({ header: 'Strict-Transport-Security', status: 'missing', severity: 'high' });
    }
    if (!headers['x-content-type-options']) {
      findings.push({ header: 'X-Content-Type-Options', status: 'missing', severity: 'medium' });
    }
    if (!headers['x-frame-options'] && !this.hasCSP(headers)) {
      findings.push({ header: 'X-Frame-Options', status: 'missing', severity: 'medium' });
    }
    if (!headers['content-security-policy']) {
      findings.push({ header: 'Content-Security-Policy', status: 'missing', severity: 'medium' });
    }
    if (!headers['x-xss-protection']) {
      findings.push({ header: 'X-XSS-Protection', status: 'missing', severity: 'low' });
    }
    if (headers['server']) {
      findings.push({ header: 'Server', status: 'exposed', severity: 'low', value: headers['server'] });
    }

    return findings;
  }

  hasCSP(headers) {
    const csp = headers['content-security-policy'] || '';
    return csp.includes('frame-ancestors');
  }

  checkCaching(headers) {
    return {
      cacheControl: headers['cache-control'] || null,
      expires: headers['expires'] || null,
      etag: headers['etag'] || null,
      lastModified: headers['last-modified'] || null,
      pragma: headers['pragma'] || null,
    };
  }

  getServerInfo(headers) {
    return {
      server: headers['server'] || 'Unknown',
      poweredBy: headers['x-powered-by'] || null,
      via: headers['via'] || null,
    };
  }

  countCookies(headers) {
    const setCookie = headers['set-cookie'];
    if (!setCookie) return 0;
    return Array.isArray(setCookie) ? setCookie.length : 1;
  }
}

module.exports = HeaderAnalyzer;
