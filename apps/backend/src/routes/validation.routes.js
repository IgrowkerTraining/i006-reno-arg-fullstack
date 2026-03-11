const express = require('express');
const router = express.Router();
const ValidationController = require('../controllers/validationController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Validations
 *   description: Gestión de aprobaciones y revisiones técnicas de reportes
 */

/**
 * @swagger
 * /api/validations:
 *   get:
 *     summary: Obtener todas las validaciones técnicas
 *     description: Retorna el listado de todos los estados de validación de los reportes.
 *     tags: [Validations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de validaciones obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Validation'
 */
router.get('/', verifyToken, ValidationController.getAllValidations);

/**
 * @swagger
 * /api/validations/{id}:
 *   patch:
 *     summary: Actualizar estado de una validación técnica
 *     description: Permite aprobar o rechazar un reporte.
 *     tags: [Validations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la validación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidationUpdateInput'
 *     responses:
 *       200:
 *         description: Validación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Validation'
 *       404:
 *         description: No se encontró la validación
 *       401:
 *         description: No autorizado - Token faltante o inválido
 */
router.patch('/:id', verifyToken, ValidationController.updateValidation);

module.exports = router;