const AnalysisIaService = require('../services/analysisIAService.js');
const Helper = require('../utils/helper.js');
// import AnalysisIaService from "../services/analysisIAService.js";

class AnalysisIaController {

    static async create(req, res, next) {
        try {
            const { projectId } = req.params;
            const { month, year } = req.body;

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
            const formattedResult = Helper.transformKeysToSnakeCase(result);
            return res.status(201).json({
                data: formattedResult
            });

        } catch (error) {
            console.error("AnalysisIaController:", error);
            if (!error.status) error.status = 500;
            next(error);
        };
    }
    static async getHistory(req, res, next) {
        try {
            const { projectId } = req.params;

            if (!projectId) {
                const error = new Error('Project ID is required');
                error.status = 400;
                return next(error);
            }

            const history = await AnalysisIaService.getProjectHistory(Number(projectId));
            return res.status(200).json({
                success: true,
                count: history.length,
                data: history
            });
        } catch (error) {
            console.error("Error fetching project history:", error);

            if (!error.status) error.status = 500;
            next(error);
        }
    }
    static async getAllAnalyses(req, res, next) {
        try {
            const analyses = await AnalysisIaService.getAllAnalyses();
            return res.status(200).json({
                success: true,
                count: analyses.length,
                data: analyses
            });
        } catch (error) {
            console.error("Error fetching all analyses:", error);

            if (!error.status) error.status = 500;
            next(error);
        }
    }
    static async getAnalysisById(req, res, next) {
        try {
            const { id } = req.params;

            const analysis = await AnalysisIaService.getAnalysisById(id);

            if (!analysis) {
                const error = new Error(`Analysis with ID ${id} not found`);
                error.status = 404;
                return next(error);
            }
            return res.status(200).json({
                success: true,
                data: analysis
            });

        } catch (error) {
            console.error("Controller Error - getById:", error.message);
            if (!error.status) error.status = 500;
            next(error);
        }
    }
}
module.exports = AnalysisIaController;
