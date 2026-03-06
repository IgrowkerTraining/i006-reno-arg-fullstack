const ProjectService = require('../services/projectService');

class ProjectController {
    static async getAllProjects(req, res, next) {
        try {

            const { name } = req.query;

            if (name) {

                const projects = await ProjectService.searchProjectByName(name);
                return res.status(200).json({
                    success: true,
                    count: projects.length,
                    data: projects
                });
            }


            const projects = await ProjectService.getAllProjects();
            return res.status(200).json({
                success: true,
                count: projects.length,
                data: projects
            });

        } catch (error) {
            return next(error);
        }
    }
    static async getProjectById(req, res, next) {
        try {
            const { id } = req.params;
            const project = await ProjectService.getProjectDetails(id);

            if (project) {
                return res.status(200).json(project);
            } else {
                const error = new Error('Project not found');
                error.status = 404;
                return next(error);
            }
        } catch (error) {
            return next(error);
        }
    }
    static async createProject(req, res, next) {
        try {
            const project = await ProjectService.createFullProject(req.body);
            if (!project) {
                const error = new Error('Project not created');
                error.status = 400;
                return next(error);
            }
            return res.status(201).json(project);
        } catch (error) {
            return next(error);
        }
    }
    static async updateProjectArt(req, res, next) {
        try {
            const { id } = req.params;
            const { artCoverageId } = req.body;

            const updatedProject = await ProjectService.updateProjectArt(id, artCoverageId);

            if (!updatedProject) {
                const error = new Error('Project not found or could not be updated');
                error.status = 404;
                return next(error);
            }

            return res.status(200).json({
                message: 'ART coverage updated successfully',
                project: updatedProject
            });
        } catch (error) {
            return next(error);
        }
    }
    static async getUserProjects(req, res, next) {
        try {
            const userId = req.user.id;
            const projects = await ProjectService.getUserProjects(userId);

            return res.status(200).json(projects);

        } catch (error) {
            next(error);
        }
    }
    static async getProjectByName(req, res, next) {
        try {
            const { name } = req.query;

            const projects = await ProjectService.searchProjectByName(name);

            console.log("Buscando proyecto con el término:", name);
            return res.status(200).json({
                success: true,
                data: projects
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProjectController;