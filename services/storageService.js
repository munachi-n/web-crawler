const fs = require('fs');
const path = require('path');

class StorageService {
  constructor(options = {}) {
    this.dataDir = options.dataDir || path.join(__dirname, '..', 'data');
    this._ensureDir(this.dataDir);
  }

  save(collection, id, data) {
    const dir = path.join(this.dataDir, collection);
    this._ensureDir(dir);
    const filePath = path.join(dir, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return filePath;
  }

  load(collection, id) {
    const filePath = path.join(this.dataDir, collection, `${id}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  list(collection) {
    const dir = path.join(this.dataDir, collection);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''));
  }

  delete(collection, id) {
    const filePath = path.join(this.dataDir, collection, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }

  count(collection) {
    return this.list(collection).length;
  }

  _ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

module.exports = StorageService;
