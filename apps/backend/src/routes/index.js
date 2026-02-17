const express = require('express');

const authRoutes = require('./auth.routes');
const healthRoutes = require('./health');
const userRoutes = require('./user.routes');
const projectRoutes = require('./project.routes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/health', healthRoutes);
router.use('/projects', projectRoutes);

module.exports = router;
