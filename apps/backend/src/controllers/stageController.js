const StageService = require('../services/stageService');

class StageController {
    static async getStagesByProject(req, res,next) {
        try {
            const { projectId } = req.params;
            const stages = await StageService.getProjectStages(projectId);
            
            if (stages.length === 0) {
                const error = new Error('No stages found for this project');
                error.status = 404;
                return next(error);
            }
            res.status(200).json(stages);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = StageController;