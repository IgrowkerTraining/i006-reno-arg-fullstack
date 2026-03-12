const ReportService = require('../services/reportService');

class ReportController {
    static async getAllReports(req, res, next) {
        try {
            const reports = await ReportService.getAllReports();
            res.status(200).json(reports);
        } catch (error) {
            const err = new Error("Reports not found");
            err.status = 500;
            err.details = error.message;
            return next(err);
        }
    }
    static async getInitialData(req, res, next) {
        try {
            const { idProject } = req.params;
            const data = await ReportService.getInitialData(idProject);
            return res.status(200).json(data);
        } catch (error) {
            return next(error);
        }
    }
    static async createDailyReport(req, res, next) {
        try {
            const report = await ReportService.createDailyReport(req.body);
            if (!report) {
                const error = new Error('Report creation failed.');
                error.status = 400;
                return next(error);
            }
            return res.status(201).json(report);
        } catch (error) {
            return next(error);
        }
    }
    static async getReportDetail(req, res, next) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                const error = new Error(`ID not valid: (${id}) must be a number`);
                error.status = 400;
                return next(error);
            }

            const report = await ReportService.getReportById(id);
            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: `Report with ID: ${id} not found`
                });
            }

            return res.status(200).json({
                success: true,
                data: report
            });

        } catch (error) {
            console.error(`[ReportController] Error fetching report ${req.params.id}:`, error.message);
            return next(error);
        }
    }
    static async getReportsByProject(req, res, next) {
        try {
            const { projectId } = req.params;
            const reports = await ReportService.getReportsByProjectId(projectId);

            return res.status(200).json({
                success: true,
                count: reports.length,
                data: reports
            });
        } catch (error) {
            console.error("Error en ReportController:", error);
            next(error);
        }
    }
}

module.exports = ReportController;