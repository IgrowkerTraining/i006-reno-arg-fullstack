const AnalysisIaService = require('../services/analysisIAService');

class AnalysisIaController {
    
   static async create(req, res, next) {
    try {
        const { projectId } = req.params;      
        const { month, year } = req.body;

        if (!month || !year || !projectId) {
            const error = new Error('Month, year, and project ID are required');
            error.status = 400;
            return next(error);
        }
        const result = await AnalysisIaService.createIaAnalysis(
            Number(projectId), 
            Number(month), 
            Number(year)
        );

        if (!result) {
            const error = new Error('data not found for the given project and period');
            error.status = 404;
            return next(error);
        }
        return res.status(201).json({
            data: result
        });

    } catch (error) {
        console.error("AnalysisIaController:", error);
        if (!error.status) error.status = 500;           
            next(error); 
        };
    }  
}
module.exports = AnalysisIaController;