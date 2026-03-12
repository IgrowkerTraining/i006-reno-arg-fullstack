const db = require('../config/db');
const Project = require('../models/Project');
const StageService = require('../services/stageService');
const TaskService = require('../services/taskService');
const ArtService = require('../services/artService');

class ProjectService {

    static async getAllProjects() {
        const rows = await Project.getAll();

        if (!rows) return [];

        return rows.map(row => {
            const projectInstance = new Project(row);
            return projectInstance.toJSON();
        });
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
                let finalArtId = null;

                if (data.id_art) {
                    finalArtId = await ArtService.createArtCoverage({
                        id_cat_art: data.id_art,
                        estado_art: true
                    }, t);
                }
                const newProject = await Project.create({
                    nombre: data.nombre,
                    ubicacion: data.ubicacion,
                    superficie_m2: data.superficie_m2,
                    id_responsable: data.id_responsable,
                    id_sistema_constructivo: data.id_sistema_constructivo,
                    id_art: finalArtId
                }, t);

                const pid = newProject.id || newProject.id_proyecto;
                if (!pid) throw new Error("Project ID not found after creation");
                if (data.etapas && Array.isArray(data.etapas)) {

                    for (const etapaData of data.etapas) {
                        const newStage = await StageService.createStage({
                            projectId: pid,
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
                const currentYear = new Date().getFullYear();
                const generatedCode = `RENO-ARG-${currentYear}-${pid}`;

                await Project.updateCode(pid, generatedCode, t);
                newProject.code = generatedCode;
                return newProject;
            });
        } catch (error) {
            console.error("Error ProjectService.createFullProject:", error.message);
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
    static async getFullProject(projectId) {
        try {
            const projectData = await Project.getFullProjectDetail(projectId);

            if (!projectData) {
                return null;
            }
            return projectData;
        } catch (error) {
            console.error("Error ProjectService.getFullProject:", error.message);
            throw error;
        }
    }
}
module.exports = ProjectService;