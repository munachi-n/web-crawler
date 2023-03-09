const fs = require('fs');
const UrlHelper = require('./urlHelper');

class SeedLoader {
  static fromFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Seed file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return SeedLoader.fromText(content);
  }

  static fromText(text) {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .filter((url) => UrlHelper.isValidUrl(url));
  }

  static fromArray(urls) {
    return urls.filter((url) => UrlHelper.isValidUrl(url));
  }

  static toFile(urls, filePath) {
    const content = urls.join('\n') + '\n';
    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
  }
}

module.exports = SeedLoader;
