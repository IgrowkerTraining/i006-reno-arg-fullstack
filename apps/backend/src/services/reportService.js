const { db } = require('../config');
const Report = require('../models/Report');
const Validation = require('../models/Validation');
const CatalogService = require('./catalogService');

class ReportService {

    static async getInitialData(idProject) {
        const [tasks, catalogData] = await Promise.all([
            Report.getTasksForReport(idProject),
            CatalogService.getReportSetupData()
        ]);
        return {
            tasks,
            trades: catalogData.trades,
            safety: catalogData.safetyMeasures
        };
    }
    static async createDailyReport(reportData) {
        return await db.tx(async t => {

        const newReport = await Report.saveFullReport(reportData, t);
        await Validation.create(t, newReport.id);
        return newReport;
        });
    }
    static async getReportById(id) {
        return await Report.getReportById(id);
    }
    static async getAllReports() {
        return await Report.getAllReports();
    }

}
module.exports = ReportService;