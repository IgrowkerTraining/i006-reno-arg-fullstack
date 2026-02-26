const { Router } = require('express');
const ProjectController = require('../controllers/projectController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = Router();

router.get('/my-projects', verifyToken, ProjectController.getUserProjects);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtener todos los proyectos
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proyecto'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Token inválido, expirado o no proporcionado
 *               status: 401
 */
router.get('/', verifyToken, ProjectController.getAllProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtener detalle completo de un proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del proyecto
 *     responses:
 *       200:
 *         description: Detalle del proyecto con etapas y tareas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProyectoDetalle'
 *       404:
 *         description: Proyecto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: El proyecto solicitado no existe
 *               status: 404
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Token inválido o expirado
 *               status: 401
 */
router.get('/:id', verifyToken, ProjectController.getProjectById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crear un proyecto completo (Transaccional)
 *     description: Registra un proyecto junto con sus etapas y tareas asociadas en un solo paso.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreateInput'
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *       400:
 *         description: Error en los datos enviados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: El nombre del proyecto es obligatorio
 *               status: 400
 */
router.post('/', verifyToken, ProjectController.createProject);
router.patch('/:id/art', verifyToken, ProjectController.updateProjectArt);

module.exports = router;