const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

router.post('/', TaskController.create);

router.get('/stage/:stageId', TaskController.getByStage);

module.exports = router;