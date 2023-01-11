const fs = require('fs');
const path = require('path');

class Logger {
  static LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
  };

  constructor(options = {}) {
    this.level = Logger.LEVELS[options.level] ?? Logger.LEVELS.INFO;
    this.logToFile = options.logToFile || false;
    this.logDir = options.logDir || path.join(__dirname, '..', 'logs');

    if (this.logToFile) {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    }
  }

  _format(level, message, data) {
    const timestamp = new Date().toISOString();
    const entry = { timestamp, level, message };
    if (data) entry.data = data;
    return entry;
  }

  _write(entry) {
    const line = `[${entry.timestamp}] ${entry.level}: ${entry.message}`;
    console.log(line);

    if (this.logToFile) {
      const date = entry.timestamp.split('T')[0];
      const filePath = path.join(this.logDir, `${date}.log`);
      fs.appendFileSync(filePath, JSON.stringify(entry) + '\n');
    }
  }

  error(message, data) {
    if (this.level >= Logger.LEVELS.ERROR) {
      this._write(this._format('ERROR', message, data));
    }
  }

  warn(message, data) {
    if (this.level >= Logger.LEVELS.WARN) {
      this._write(this._format('WARN', message, data));
    }
  }

  info(message, data) {
    if (this.level >= Logger.LEVELS.INFO) {
      this._write(this._format('INFO', message, data));
    }
  }

  debug(message, data) {
    if (this.level >= Logger.LEVELS.DEBUG) {
      this._write(this._format('DEBUG', message, data));
    }
  }
}

module.exports = Logger;
