
const snapshotModule = require('../mocks/snapshotMock');
const snapshotMock = snapshotModule.default;  // 👈 usar el default
// const Project = require('../models/Project');
// const AnalysisIA = require('../models/AnalysisIA');

class AnalysisIAService {

    static async createIaAnalysis(projectId, month, year) {
        const resultIA = await this.callExternalAI(snapshotMock); //comentado hasta que se obtena URL API IA
        // const resultIA = await this.callExternalAI(requestBody2); //comentado hasta que se obtena URL API IA
        return await resultIA;
        //  const savedAnalysis = await AnalysisIA.save(projectId, finalPayload);
        // return savedAnalysis; 
        //return finalPayload; // Retorno el payload que se enviaría a la IA para pruebas
    }
    static async callExternalAI(requestBody) {
        const AI_URL = 'https://orange-space-adventure-4j6747vw4vvj2q59j-8000.app.github.dev/api/v1/analisis/iniciar';
        // console.log("Body enviado:", requestBody);
        const response = await fetch(AI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody )
        });

        
        // if (!response.ok) {
        //     throw new Error(`AI_SERVICE_ERROR: ${response.status} ${response.statusText}`);
        // }
        return await response.json();
    } catch (error) {
        console.error("Error en la conexión:", error.message);
        throw error;
    }
}



module.exports = AnalysisIAService; 
