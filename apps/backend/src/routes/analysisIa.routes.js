const express = require('express');
const router = express.Router();

const AIAnalysisController = require('../controllers/analysisIaController');
/**
 * @swagger
 * /api/analysis-ia/generate/{projectId}:
 *   post:
 *     summary: Generar reporte mensual de IA
 *     tags: [ReportsAI]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID único del proyecto
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - year
 *             properties:
 *               month:
 *                 type: integer
 *                 description: Mes a analizar (1-12)
 *                 example: 2
 *               year:
 *                 type: integer
 *                 description: Año a analizar (YYYY)
 *                 example: 2026
 *     responses:
 *       201:
 *         description: Reporte generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalysisIAResponse'
 */

router.post('/generate/:projectId', AIAnalysisController.create);

module.exports = router;