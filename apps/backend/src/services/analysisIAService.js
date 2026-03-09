
//const snapshotModule = require('../mocks/snapshotMock');
//const snapshotMock = snapshotModule.default;
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

}

module.exports = AnalysisIAService; 
