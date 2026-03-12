const Task = require('../models/Task');

class TaskService {
    static async createTask(taskData, t) {
        const newTask = await Task.create(taskData, t);
        return newTask ? newTask : null;
    }

    static async getTasksByStage(stageId) {
        return await Task.findByStageId(stageId);
    }
}

module.exports = TaskService;