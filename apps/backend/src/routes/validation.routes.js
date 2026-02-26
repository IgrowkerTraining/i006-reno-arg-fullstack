const express = require('express');
const router = express.Router();
const ValidationController = require('../controllers/validationController');

router.get('/', ValidationController.getAllValidations);

module.exports = router;