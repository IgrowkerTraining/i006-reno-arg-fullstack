const Stage = require('../models/Stage');

class StageService {
    static async getProjectStages(projectId) {
        // Podrías validar aquí si el proyecto existe antes de buscar las etapas
        return await Stage.findByProjectId(projectId);
    }
}

module.exports = StageService;