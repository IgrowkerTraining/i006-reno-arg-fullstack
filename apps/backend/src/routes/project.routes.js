const {Router} = require('express');
const ProjectController = require('../controllers/projectController');

const router = Router();

router.get('/', ProjectController.getAllProjects);
router.get('/:id', ProjectController.getProjectById);
router.post('/', ProjectController.createProject);
router.patch('/:id/art', ProjectController.updateProjectArt);

module.exports = router;