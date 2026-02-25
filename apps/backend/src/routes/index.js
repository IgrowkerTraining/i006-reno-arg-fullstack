const express = require('express');

const authRoutes = require('./auth.routes');
const healthRoutes = require('./health');
const userRoutes = require('./user.routes');
const projectRoutes = require('./project.routes');
const catalogRoutes = require('./catalog.routes');
const stageRoutes = require('./stage.routes');
const taskRoutes = require('./task.routes');
const reportRoutes = require('./report.routes');
const analysisIaRoutes = require('./analysisIa.routes');
const dashboardRoutes = require('./dashboardSummary.routes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/health', healthRoutes);
router.use('/projects', projectRoutes);
router.use('/catalog', catalogRoutes);
router.use('/stages', stageRoutes);
router.use('/tasks', taskRoutes);
router.use('/reports', reportRoutes);
router.use('/analysis-ia', analysisIaRoutes);
router.use('/dashboard', dashboardRoutes);
module.exports = router;
