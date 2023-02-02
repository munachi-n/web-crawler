const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobController');
const Validator = require('../middlewares/validator');

// POST /api/jobs - Create a new crawl job
router.post('/', Validator.crawlRequest, JobController.createJob);

// GET /api/jobs - List all jobs
router.get('/', JobController.listJobs);

// GET /api/jobs/:id - Get a specific job
router.get('/:id', JobController.getJob);

module.exports = router;
