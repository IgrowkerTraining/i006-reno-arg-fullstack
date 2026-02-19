const express = require('express');
const router = express.Router();
const StageController = require('../controllers/stageController');

// El :projectId viene como parámetro en la URL
router.get('/project/:projectId', StageController.getStagesByProject);

module.exports = router;