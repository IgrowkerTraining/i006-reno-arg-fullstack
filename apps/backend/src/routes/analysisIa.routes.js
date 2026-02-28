const express = require('express');
const router = express.Router();

const AIAnalysisController = require('../controllers/analysisIaController');
/**
 * @swagger
 * /api/analysis-ia/generate/{projectId}:
 *   post:
 *     summary: Generar análisis mensual de IA
 *     description: Recupera todos los reportes del mes y genera un análisis semántico utilizando Inteligencia Artificial.
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [month, year]
 *             properties:
 *               month:
 *                 type: integer
 *                 example: 2
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       200:
 *         description: Análisis generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIAnalysisResponse'
 *       404:
 *         description: No se encontraron datos para el período
 */
router.post('/generate/:projectId', AIAnalysisController.create);


module.exports = router;