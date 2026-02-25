const express = require('express');
const router = express.Router();
const DashboardSummaryController = require('../controllers/dashboardSumaryController');

router.get('/stats', DashboardSummaryController.getStats);

module.exports = router;