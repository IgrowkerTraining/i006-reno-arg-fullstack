const express = require('express');
const router = express.Router();
const CatalogController = require('../controllers/catalogController');

router.get('/planning', CatalogController.getPlanningCatalog);
router.get('/report', CatalogController.getReportCatalog);

module.exports = router;