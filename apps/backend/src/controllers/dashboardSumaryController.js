
const DashboardService = require('../services/dashboardSummaryService');

class DashboardSummaryController {
    static async getStats(req, res, next) {
        try {
            const stats = await DashboardService.getStats();
            return res.status(200).json(stats);
        } catch (error) {
            return next(error);
        }
    }
}
module.exports = DashboardSummaryController;