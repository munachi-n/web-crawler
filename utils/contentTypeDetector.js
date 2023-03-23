const path = require('path');

class ContentTypeDetector {
  static MIME_MAP = {
    '.html': 'text/html', '.htm': 'text/html',
    '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.xml': 'application/xml',
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4', '.webm': 'video/webm',
    '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
    '.zip': 'application/zip', '.gz': 'application/gzip',
    '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  static fromUrl(url) {
    try {
      const parsed = new URL(url);
      const ext = path.extname(parsed.pathname).toLowerCase();
      return this.MIME_MAP[ext] || 'text/html';
    } catch {
      return 'text/html';
    }
  }

  static fromHeader(contentType) {
    return (contentType || '').split(';')[0].trim().toLowerCase();
  }

  static isText(contentType) {
    const type = this.fromHeader(contentType);
    return type.startsWith('text/') || type.includes('json') || type.includes('xml') || type.includes('javascript');
  }

  static isImage(contentType) {
    return this.fromHeader(contentType).startsWith('image/');
  }

  static isCrawlable(contentType) {
    const type = this.fromHeader(contentType);
    return type === 'text/html' || type === 'application/xhtml+xml';
  }

  static isMedia(contentType) {
    const type = this.fromHeader(contentType);
    return type.startsWith('video/') || type.startsWith('audio/');
  }
}

module.exports = ContentTypeDetector;
