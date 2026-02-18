const Project = require('../models/Project');

class ProjectService {

    static async getAllProjects() {
        const projects = await Project.getAll();
        return projects.map(project => project.toJSON());
    }
    static async getProjectById(id) {
        const project = await Project.findById(id);
        if (!project) {
            return null;
        }
        return {
            ...project.toJSON(),
            stages: []
        };
    }
    static async createProject(projectData) {
        const newProject = await Project.create(projectData);
        if (!newProject) {
            return null;
        }
        return await this.getProjectById(newProject.id);
    }
    static async updateProjectArt(id, artCoverageId) {
        const project = await Project.findById(id);
        
        if (!project) {
            return null;
        }
        const updatedProject = await Project.updateArt(artCoverageId, id);
        return updatedProject ? updatedProject.toJSON() : null;
    }
}

module.exports = ProjectService;