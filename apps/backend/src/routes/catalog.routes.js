const express = require('express');
const router = express.Router();
const CatalogController = require('../controllers/catalogController');


/**
 * @swagger
 * /api/catalog/planning:
 *   get:
 *     summary: Obtiene la estructura maestra para planificar un proyecto nuevo
 *     description: Retorna los sistemas constructivos, las coberturas de ART y el árbol jerárquico de etapas con sus tareas disponibles.
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: Estructura de planificación obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectSetupData'
 *       500:
 *         description: Error al recuperar los catálogos de planificación.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/planning', CatalogController.getPlanningCatalog);

/**
 * @swagger
 * /api/catalog/report:
 *   get:
 *     summary: Obtiene los catálogos para el formulario de reporte
 *     description: Retorna un objeto con los listados de oficios (trades) y medidas de seguridad (safetyMeasures).
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: Catálogos obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportSetupData'
 *       500:
 *         description: Error al obtener los catálogos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/report', CatalogController.getReportCatalog);

module.exports = router;