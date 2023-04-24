const Sanitizer = require('../utils/sanitizer');

describe('Sanitizer', () => {
  describe('stripHtml', () => {
    test('removes HTML tags', () => {
      expect(Sanitizer.stripHtml('<p>Hello <b>world</b></p>')).toBe('Hello world');
    });

    test('handles empty string', () => {
      expect(Sanitizer.stripHtml('')).toBe('');
    });
  });

  describe('escapeHtml', () => {
    test('escapes special characters', () => {
      expect(Sanitizer.escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });
  });

  describe('truncate', () => {
    test('truncates long strings', () => {
      const long = 'a'.repeat(300);
      const result = Sanitizer.truncate(long, 200);
      expect(result.length).toBeLessThanOrEqual(203);
      expect(result.endsWith('...')).toBe(true);
    });

    test('does not truncate short strings', () => {
      expect(Sanitizer.truncate('short', 200)).toBe('short');
    });
  });

  describe('slugify', () => {
    test('creates URL-friendly slug', () => {
      expect(Sanitizer.slugify('Hello World!')).toBe('hello-world');
    });

    test('handles multiple spaces', () => {
      expect(Sanitizer.slugify('  multiple   spaces  ')).toBe('multiple-spaces');
    });
  });

  describe('clean', () => {
    test('strips HTML and normalizes whitespace', () => {
      expect(Sanitizer.clean('<p>Hello  \n  World</p>')).toBe('Hello World');
    });

    test('returns empty string for non-string input', () => {
      expect(Sanitizer.clean(null)).toBe('');
      expect(Sanitizer.clean(42)).toBe('');
    });
  });
});
