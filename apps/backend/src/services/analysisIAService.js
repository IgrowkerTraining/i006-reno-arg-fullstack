
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
        //const resultIA = await this.callExternalAI(snapshotMock); //comentado hasta que se obtena URL API IA
        // const resultIA = await this.callExternalAI(requestBody2); //comentado hasta que se obtena URL API IA
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
        console.error("Error in the connection:", error.message);
        throw error;
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
