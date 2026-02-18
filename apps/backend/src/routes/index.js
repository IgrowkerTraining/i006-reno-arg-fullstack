const express = require('express');

const authRoutes = require('./auth.routes');
const healthRoutes = require('./health');
const userRoutes = require('./user.routes');
const projectRoutes = require('./project.routes');
const catalogRoutes = require('./catalog.routes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/health', healthRoutes);
router.use('/projects', projectRoutes);
router.use('/catalog', catalogRoutes);

module.exports = router;
