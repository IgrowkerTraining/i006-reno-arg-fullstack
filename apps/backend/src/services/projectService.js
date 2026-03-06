const db = require('../config/db');

const Project = require('../models/Project');
const StageService = require('../services/stageService');
const TaskService = require('../services/taskService');

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
    static async createFullProject(data) {
        try {
            return await db.tx(async t => {
                const newProject = await Project.create({
                    nombre: data.nombre,
                    ubicacion: data.ubicacion,
                    superficie_m2: data.superficie_m2,
                    id_responsable: data.id_responsable,
                    id_sistema_constructivo: data.id_sistema_constructivo,
                    id_art: data.id_art || null,
                    matricula_responsable: data.matricula_responsable
                }, t);
                const currentYear = new Date().getFullYear();
                const generatedCode = `RENO-ARG-${currentYear}-${newProject.id}`;
                await Project.updateCode(newProject.id, generatedCode, t);
                newProject.code = generatedCode;

                if (data.etapas && Array.isArray(data.etapas)) {
                    for (const etapaData of data.etapas) {
                        const newStage = await StageService.createStage({
                            projectId: newProject.id,
                            typeStageId: etapaData.id_tipo_etapa,
                            startDate: etapaData.fecha_inicio
                        }, t);

                        if (etapaData.tareas && Array.isArray(etapaData.tareas)) {
                            for (const typeTaskId of etapaData.tareas) {
                                await TaskService.createTask({
                                    stageId: newStage.id,
                                    typeTaskId: typeTaskId
                                }, t);
                            }
                        }
                    }
                }
                return newProject;
            });
        } catch (error) {          
            console.error("Error createFullProject:", error.message);
            throw error;
        }
    }
    static async updateProjectArt(id, artCoverageId) {
        const project = await Project.findById(id);

        if (!project) {
            return null;
        }
        const updatedProject = await Project.updateArt(artCoverageId, id);
        return updatedProject ? updatedProject.toJSON() : null;
    }
    static async getProjectDetails(projectId) {

    const project = await Project.findById(projectId);
    if (!project) return null;

    const stages = await StageService.getProjectStages(projectId);
    project.stages = await Promise.all(stages.map(async (stage) => {
        const tasks = await TaskService.getTasksByStage(stage.id);
        return {
            ...stage,
            tasks: tasks
        };
    }));

    return project;
}
static async getUserProjects(userId) {
    const projects = await Project.getProjectsByUserId(userId);
        
        if (!projects) {
            return [];
        }

        return projects;
    }

    
    static async searchProjectByName(name) {
    if (!name) return [];
    return await Project.findByName(name);
}
}

module.exports = ProjectService;