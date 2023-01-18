const fs = require('fs');
const path = require('path');

class Exporter {
  static toJSON(data, filePath) {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
  }

  static toCSV(data, filePath) {
    if (!data.length) {
      fs.writeFileSync(filePath, '', 'utf-8');
      return filePath;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((h) => {
        const val = row[h] == null ? '' : String(row[h]);
        return val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      }).join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    fs.writeFileSync(filePath, csv, 'utf-8');
    return filePath;
  }

  static toHTML(data, filePath) {
    if (!data.length) {
      fs.writeFileSync(filePath, '<p>No data</p>', 'utf-8');
      return filePath;
    }

    const headers = Object.keys(data[0]);
    const headerRow = headers.map((h) => `<th>${h}</th>`).join('');
    const bodyRows = data.map((row) =>
      '<tr>' + headers.map((h) => `<td>${row[h] ?? ''}</td>`).join('') + '</tr>'
    ).join('\n');

    const html = `<!DOCTYPE html>
<html><head><title>Crawl Results</title>
<style>table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f4f4f4}</style>
</head><body><h1>Crawl Results</h1>
<table><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>
</body></html>`;

    fs.writeFileSync(filePath, html, 'utf-8');
    return filePath;
  }

  static getExportDir() {
    const dir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
  }
}

module.exports = Exporter;
