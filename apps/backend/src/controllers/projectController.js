const ProjectService = require('../services/projectService');

class ProjectController {
    static async getAllProjects(_req, res, next) {
        try {
            const projects = await ProjectService.getAllProjects();
            return res.status(200).json(projects);
        } catch (error) {
            return next(error);
        }
    }

    static async getProjectById(req, res, next) {
        try {
            const { id } = req.params;
            const project = await ProjectService.getProjectById(id);
          if(!project) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
          }
          return res.status(200).json(project);
        } catch (error) {
            return next(error);
        }
    }
    static async createProject(req, res, next) {
       try {
        const project = await ProjectService.createProject(req.body);
        if(!project) {
          const error = new Error('Project not created');
          error.status = 400;
          return next(error);
        }
        return res.status(201).json(project);
       } catch (error) {
        return next(error);
       }
    }
}

module.exports = ProjectController;