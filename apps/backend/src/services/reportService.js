
const db = require('../config/db');
const Report = require('../models/Report');
const Validation = require('../models/Validation');
const CatalogService = require('./catalogService');
const Task = require('../models/Task');
const Stage = require('../models/Stage');
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

            const reportId = newReport.id;

            if (!reportId) {
                throw new Error("ID report not generated.");
            }
            await Validation.create(t, reportId);

            if (reportData.selectedTasks && reportData.selectedTasks.length > 0) {
                const taskIds = reportData.selectedTasks;

                const updatedTasks = await Task.updateStatusTasks(t, taskIds);
                const stageIds = [...new Set(updatedTasks.map(task => task.id_etapa))];

                for (const stageId of stageIds) {
                    await Stage.checkAndCloseStage(t, stageId);
                }
                const currentProgress = await Stage.getProjectProgress(t, reportData.idProject);

                await Report.updateProgress(t, reportId, currentProgress);

                newReport.progressPercentage = currentProgress;
            }

            return newReport;
        });
    }

    static async getReportById(id) {
        return await Report.getReportById(id);
    }
    static async getAllReports() {
        return await Report.getAllReports();
    }

    static async getReportsByProjectId(projectId) {

        const reports = await Report.findByProjectId(projectId);

        if (!reports || reports.length === 0) {
            return [];
        }
        return reports;
    }

}
module.exports = ReportService;