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

/**
 * @swagger
 * /api/analysis-ia/history/{projectId}:
 *   get:
 *     summary: Obtener el historial de análisis de un proyecto
 *     tags: [ReportsAI]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de análisis recuperada con éxito
 */
router.get('/history/:projectId', AIAnalysisController.getHistory);

/**
 * @swagger
 * /api/analysis-ia:
 *   get:
 *     summary: Recuperar todos los análisis del sistema
 *     description: Retorna una lista completa de todos los informes de IA generados para cualquier proyecto.
 *     tags: [ReportsAI]
 *     responses:
 *       200:
 *         description: Lista obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AnalysisIAResponse'
 */
router.get('/', AIAnalysisController.getAllAnalyses);

/**
 * @swagger
 * /api/analysis-ia/{id}:
 *   get:
 *     summary: Detalle de un análisis específico
 *     tags: [ReportsAI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Objeto de análisis individual
 *       404:
 *         description: No se encontró el análisis
 */
router.get('/:id', AIAnalysisController.getAnalysisById);

module.exports = router;