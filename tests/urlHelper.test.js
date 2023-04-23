const UrlHelper = require('../utils/urlHelper');

describe('UrlHelper', () => {
  describe('isValidUrl', () => {
    test('accepts valid HTTP URL', () => {
      expect(UrlHelper.isValidUrl('http://example.com')).toBe(true);
    });

    test('accepts valid HTTPS URL', () => {
      expect(UrlHelper.isValidUrl('https://example.com/path')).toBe(true);
    });

    test('rejects invalid URL', () => {
      expect(UrlHelper.isValidUrl('not-a-url')).toBe(false);
    });

    test('rejects FTP URL', () => {
      expect(UrlHelper.isValidUrl('ftp://example.com')).toBe(false);
    });

    test('rejects empty string', () => {
      expect(UrlHelper.isValidUrl('')).toBe(false);
    });
  });

  describe('normalizeUrl', () => {
    test('removes trailing slash', () => {
      expect(UrlHelper.normalizeUrl('https://example.com/')).toBe('https://example.com');
    });

    test('removes hash fragment', () => {
      expect(UrlHelper.normalizeUrl('https://example.com/page#section')).toBe('https://example.com/page');
    });

    test('returns null for invalid URL', () => {
      expect(UrlHelper.normalizeUrl('invalid')).toBeNull();
    });
  });

  describe('getDomain', () => {
    test('extracts domain from URL', () => {
      expect(UrlHelper.getDomain('https://www.example.com/path')).toBe('www.example.com');
    });

    test('returns null for invalid URL', () => {
      expect(UrlHelper.getDomain('invalid')).toBeNull();
    });
  });

  describe('isSameDomain', () => {
    test('returns true for same domain', () => {
      expect(UrlHelper.isSameDomain('https://example.com/a', 'https://example.com/b')).toBe(true);
    });

    test('returns false for different domains', () => {
      expect(UrlHelper.isSameDomain('https://a.com', 'https://b.com')).toBe(false);
    });
  });

  describe('getPathDepth', () => {
    test('returns 0 for root path', () => {
      expect(UrlHelper.getPathDepth('https://example.com/')).toBe(0);
    });

    test('returns correct depth', () => {
      expect(UrlHelper.getPathDepth('https://example.com/a/b/c')).toBe(3);
    });
  });
});
