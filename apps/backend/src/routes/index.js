const express = require('express');

const authRoutes = require('./auth.routes');
const healthRoutes = require('./health');
const userRoutes = require('./user.routes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/health', healthRoutes);

module.exports = router;
