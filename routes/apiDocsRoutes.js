const express = require('express');
const router = express.Router();
const ApiDocsController = require('../controllers/apiDocsController');

router.get('/', ApiDocsController.getDocs);

module.exports = router;
