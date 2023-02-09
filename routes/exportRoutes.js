const express = require('express');
const router = express.Router();
const ExportController = require('../controllers/exportController');

// GET /api/export/:id?format=json|csv|html
router.get('/:id', ExportController.exportJob);

module.exports = router;
