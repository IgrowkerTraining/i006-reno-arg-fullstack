const { Router } = require('express');
const ProjectController = require('../controllers/projectController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = Router();

router.get('/my-projects', verifyToken, ProjectController.getUserProjects);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtener o buscar proyectos
 *     description: Retorna todos los proyectos del usuario. Si se proporciona el parámetro 'name', filtra por coincidencia.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Nombre o parte del nombre para filtrar la búsqueda
 *         example: "Reforma"
 *     responses:
 *       200:
 *         description: Lista de proyectos (filtrada o completa)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Proyecto'
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
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
 * /api/projects/{projectId}/detail:
 *   get:
 *     summary: Obtiene el detalle completo de un proyecto
 *     description: Retorna toda la información de la obra, incluyendo etapas, tareas con sus estados y los últimos 5 registros de avance.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Detalle del proyecto obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_proyecto:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     etapas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           etapa_nombre:
 *                             type: string
 *                           estado_nombre:
 *                             type: string
 *                           tareas:
 *                             type: array
 *                             items:
 *                               type: object
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:projectId/detail', verifyToken, ProjectController.getFullProject);

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