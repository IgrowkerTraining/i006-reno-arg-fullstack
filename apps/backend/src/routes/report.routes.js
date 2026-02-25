const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');

router.get('/', ReportController.getAllReports);
router.get('/setup/:idProject', ReportController.getInitialData);
router.post('/', ReportController.createDailyReport);
router.get('/:id', ReportController.getReportDetail);
module.exports = router;