const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');


/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Obtener listado de reportes diarios
 *     description: Retorna una lista simplificada de todos los reportes (cabeceras) para la vista de tabla.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReportSummary'
 *       401:
 *         description: No autorizado - Token faltante o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ReportController.getAllReports);
/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Obtener detalle completo de un reporte
 *     description: Retorna toda la información de un reporte específico.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del reporte
 *     responses:
 *       200:
 *         description: Detalle del reporte obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportDetail'
 *       404:
 *         description: Reporte no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
router.get('/:id', ReportController.getReportDetail);

/**
 * @swagger
 * /api/reports/setup/{idProject}:
 *   get:
 *     summary: Obtener datos iniciales para el formulario de reporte
 *     description: Recupera las tareas específicas del proyecto y de oficios y seguridad.
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: idProject
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos para el formulario recuperados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                 trades:
 *                   type: array
 *                   items:
 *                     type: object
 *                 safety:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/setup/:idProject', ReportController.getInitialData);

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Crear reporte diario completo (Transaccional)
 *     description: Registra la cabecera del reporte, inserta tareas, oficios, medidas de seguridad y genera la validación técnica en una sola transacción.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReportCreateInput'
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportSummary'
 *       400:
 *         description: Error en los datos o IDs inexistentes.
 */
router.post('/', ReportController.createDailyReport);

/**
 * @swagger
 * /api/reports/project/{projectId}:
 *   get:
 *     summary: listado de reportes por id del proyecto
 *     description: Retorna la lista de reportes diarios filtrados por el ID del proyecto, ordenados por fecha descendente.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del proyecto
 *     responses:
 *       200:
 *         description: Historial de reportes recuperado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DailyReport'
 *       401:
 *         description: No autorizado
 */
router.get('/project/:projectId', ReportController.getReportsByProject);

module.exports = router;