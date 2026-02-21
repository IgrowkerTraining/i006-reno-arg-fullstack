const Stage = require('../models/Stage');

class StageService {

    static async createStage(stageData, t) {
        const newStage = await Stage.create(stageData, t);
        return newStage;
    }
    static async getProjectStages(projectId) {
        return await Stage.findByProjectId(projectId);
    }
}

module.exports = StageService;