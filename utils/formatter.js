class Formatter {
  static formatResults(results, options = {}) {
    const { compact = false, includeTimestamp = true } = options;

    return results.map((r) => {
      const formatted = {
        url: r.url,
        title: r.title || 'Untitled',
        status: r.error ? 'error' : 'success',
      };

      if (!compact) {
        formatted.description = r.metaDescription || '';
        formatted.links = r.linkCount || 0;
        formatted.images = r.imageCount || 0;
      }

      if (r.error) formatted.error = r.error;
      if (includeTimestamp) formatted.timestamp = r.timestamp;

      return formatted;
    });
  }

  static formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}m ${sec}s`;
  }

  static formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  static formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)} ${units[i]}`;
  }

  static truncateUrl(url, maxLen = 80) {
    if (url.length <= maxLen) return url;
    const start = url.substring(0, maxLen - 20);
    const end = url.substring(url.length - 15);
    return `${start}...${end}`;
  }
}

module.exports = Formatter;
