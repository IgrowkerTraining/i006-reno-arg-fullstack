const {Router} = require('express');
const ProjectController = require('../controllers/projectController');
const {verifyToken} = require('../middleware/authMiddleware');

const router = Router();
router.get('/my-projects', verifyToken, ProjectController.getUserProjects);
router.get('/',verifyToken, ProjectController.getAllProjects);
router.get('/:id', verifyToken, ProjectController.getProjectById);
router.post('/',verifyToken, ProjectController.createProject);
router.patch('/:id/art', verifyToken, ProjectController.updateProjectArt);


module.exports = router;    