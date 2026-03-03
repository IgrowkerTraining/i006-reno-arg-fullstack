const express = require('express');
const router = express.Router();

const AIAnalysisController = require('../controllers/analysisIaController');
/**
 * @swagger
 * /api/analysis-ia/generate/{projectId}:
 *   post:
 *     summary: Generar reporte mensual para auditoría
 *     tags: [ReportsAI]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectReportRequest'
 *     responses:
 *       201:
 *         description: Reporte generado correctamente
 */

router.post('/generate/:projectId', AIAnalysisController.create);

module.exports = router;