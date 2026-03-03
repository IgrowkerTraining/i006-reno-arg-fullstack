const AnalysisIaService = require('../services/analysisIAService.js');
// import AnalysisIaService from "../services/analysisIAService.js";

class AnalysisIaController {
    
   static async create(req, res, next) {
    try {
        const { projectId } = req.params;      
        const { month, year } = req.body;
    
        // if (!month || !year || !projectId) {
        //     const error = new Error('Month, year, and project ID are required');
        //     error.status = 400;
        //     return next(error);
        // }

        const errors = [];

        if (!month) {
            errors.push({ field: 'month', message: 'Month is required' });
        }

        if (!year) {
            errors.push({ field: 'year', message: 'Year is required' });
        }

        if (!projectId) {
            errors.push({ field: 'projectId', message: 'Project ID is required' });
        }

        if (errors.length > 0) {
            return res.status(400).json({
                ok: false,
                results: null,
                message: 'Validation error',
                errors
            });
        }

        const result = await AnalysisIaService.createIaAnalysis(
            Number(projectId), 
            Number(month), 
            Number(year)
        );

        if (!result) {
            //const error = new Error('data not found for the given project and period');
            const error = new Error(await result);
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
// export default AnalysisIaController;