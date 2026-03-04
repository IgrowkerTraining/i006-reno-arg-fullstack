
//const snapshotModule = require('../mocks/snapshotMock');
//const snapshotMock = snapshotModule.default;  // 👈 usar el default
const Project = require('../models/Project');
const AnalysisIA = require('../models/AnalysisIA');

class AnalysisIAService {

    static async createIaAnalysis(projectId, month, year) {

        try {

            const data = await Project.getSnapshotDataForAI(projectId, month, year);
            if (!data) {
                throw new Error('Data not found for the given project and period');
            }
            const resultIA = await this.callExternalAI(data);
            const savedAnalysis = await AnalysisIA.save(projectId, resultIA);

            return {
                success: true,
                id: savedAnalysis.id_analisis,
                analysis: resultIA
            };
        } catch (error) {
            console.error("Error getting project data or calling the AI.:", error.message);
            throw error;
        }
    }
    static async callExternalAI(requestBody) {

        const AI_URL = 'https://i006-reno-arg-ai.onrender.com/api/v1/analisis/iniciar';

        try {
            const response = await fetch(AI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`AI_SERVICE_ERROR: ${response.status} - ${JSON.stringify(errorData)}`);
            }
            return await response.json();

        } catch (error) {
            console.error("Error in the AI connection:", error.message);
            throw error;
        }
    }
    static async getProjectHistory(projectId) {
    const history = await AnalysisIA.findAllByProject(projectId);
    return history || [];
}

static async getAllAnalyses() {
    try {

        const analysis = await AnalysisIA.getAllAnalysis();    
        return analysis;
    } catch (error) {
        console.error("Error in Service while fetching all analyses:", error.message);
        throw error;
    }
}
static async getAnalysisById(id) {
    const analysis = await AnalysisIA.findById(id);
    return analysis;
}

    /*
    const data = await Project.getSnapshotDataForAI(projectId, month, year);
    try {
    
    const contextData = await Project.getSnapshotDataForAI(projectId, month, year);

    // 2. Imprimimos en consola para verificar
    console.log("-----------------------------------------");
    console.log("DATOS REALES DEL PROYECTO PARA IA:");
    console.log(JSON.stringify(contextData, null, 2));
    console.log("-----------------------------------------");

    // 3. Devolvemos los datos para que Swagger los muestre y cortamos acá para probar
    return {
        message: "Prueba de datos exitosa",
        data: contextData
    };

    /* Comentamos el resto temporalmente para que no intente llamar a la IA aún
    const resultIA = await this.callExternalAI(snapshotMock); 
    return await resultIA;
   
} catch (error) {
    console.error("Error obteniendo datos del proyecto:", error.message);
    throw error;
}
*/
}

module.exports = AnalysisIAService; 
