class Sanitizer {
  static stripHtml(str) {
    return str.replace(/<[^>]*>/g, '');
  }

  static escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return str.replace(/[&<>"']/g, (c) => map[c]);
  }

  static truncate(str, length = 200, suffix = '...') {
    if (str.length <= length) return str;
    return str.substring(0, length).trim() + suffix;
  }

  static normalizeWhitespace(str) {
    return str.replace(/\s+/g, ' ').trim();
  }

  static removeControlChars(str) {
    return str.replace(/[\x00-\x1F\x7F]/g, '');
  }

  static slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  static clean(str) {
    if (typeof str !== 'string') return '';
    return this.normalizeWhitespace(this.removeControlChars(this.stripHtml(str)));
  }
}

module.exports = Sanitizer;
