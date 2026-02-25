const Project = require('../models/Project');
const AnalysisIA = require('../models/AnalysisIA');

class AnalysisIAService {

    static async createIaAnalysis(projectId, month, year) {

        const rawData = await Project.getDataProjectReport(projectId, month, year);

        if (!rawData || rawData.length === 0) {
            return null;
        }
        const projectInfo = await Project.getProjectHeader(projectId);

        const finalPayload = {
            project: {
                id: projectInfo.id_proyecto,
                name: projectInfo.proyecto_nombre,
                created_at: projectInfo.fecha_registro,
                art_name: projectInfo.nombre_art || "No especificado",
                status: projectInfo.estado || "No especificado",
                description: projectInfo.descripcion,
                responsible: {
                    creator: projectInfo.creador_nombre,
                    creator_role: projectInfo.creador_rol_nombre,
                },
            },
            analysis_period: {
                month,
                year
            },
            reports: rawData
        };
        /*
        const resultIA = await this.callExternalAI(projectId, month, year, rawData); comentado hasta que se obtena URL API IA

        const savedAnalysis = await AnalysisIA.save(projectId, resultIA);

        return savedAnalysis;
        */

        return finalPayload; // Retorno el payload que se enviaría a la IA para pruebas
    }
    static async callExternalAI(projectId, month, year, reports) {
        const AI_URL = '....';

        const response = await fetch(AI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId,
                period: `${month}/${year}`,
                reports
            })
        });

        if (!response.ok) {
            throw new Error(`AI_SERVICE_ERROR: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Error en callExternalAI:", error.message);
        throw new Error("AI_SERVICE_ERROR: conection failed");
    }

}

module.exports = AnalysisIAService; 