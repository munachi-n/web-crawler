const path = require('path');
const Exporter = require('../utils/exporter');
const StorageService = require('../services/storageService');

const storage = new StorageService();

class ExportController {
  static async exportJob(req, res, next) {
    try {
      const { id } = req.params;
      const { format } = req.query;
      const jobData = storage.load('jobs', id);

      if (!jobData) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }

      if (!jobData.results || !jobData.results.length) {
        return res.status(400).json({ success: false, error: 'No results to export' });
      }

      const exportDir = Exporter.getExportDir();
      const timestamp = Date.now();

      switch (format) {
        case 'csv': {
          const filePath = path.join(exportDir, `${id}_${timestamp}.csv`);
          Exporter.toCSV(jobData.results, filePath);
          return res.download(filePath);
        }
        case 'html': {
          const filePath = path.join(exportDir, `${id}_${timestamp}.html`);
          Exporter.toHTML(jobData.results, filePath);
          return res.download(filePath);
        }
        case 'json':
        default: {
          const filePath = path.join(exportDir, `${id}_${timestamp}.json`);
          Exporter.toJSON(jobData.results, filePath);
          return res.download(filePath);
        }
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExportController;
