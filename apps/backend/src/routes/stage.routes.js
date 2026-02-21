const express = require('express');
const router = express.Router();
const StageController = require('../controllers/stageController');

router.get('/project/:projectId', StageController.getStagesByProject);

module.exports = router;