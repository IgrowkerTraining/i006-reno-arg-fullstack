const express = require('express');
const router = express.Router();
const AIAnalysisController = require('../controllers/analysisIaController');

router.post('/generate/:projectId', AIAnalysisController.create);


module.exports = router;