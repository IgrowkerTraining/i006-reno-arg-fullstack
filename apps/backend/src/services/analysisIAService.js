const Project = require('../models/Project');
const AnalysisIA = require('../models/AnalysisIA');

class AnalysisIAService {

    static async createIaAnalysis(projectId, month, year) {
    
    const contextData = await Project.getMonthlyDataForAI(projectId, month, year);

    if (!contextData || contextData.length === 0) {
        return { 
            error: "No se encontraron registros de avance para el período seleccionado.",
            status: 404 
        };
    }

    try {  
        //this.callExternalAI(projectId, month, year, contextData); // Descomentar para usar la función real de llamada a la IA externa
        
        return {
            success: true,
            data: contextData,
        };
    } catch (error) {
        console.error("Error al procesar análisis con IA:", error);
        throw error;
    }
}
static async callExternalAI(contextData) {
    const AI_URL = '....';

    try {
        const response = await fetch(AI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contextData)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en la conexión:", error.message);
        throw error;
    }
}

}

module.exports = AnalysisIAService; 