const TaskService = require('../services/taskService');

class TaskController {
    static async create(req, res, next) {
        try {
            const task = await TaskService.createTask(req.body);      
            if (!task) {
                const error = new Error("Task creation failed.");
                error.status = 400;
                return next(error);            
            }
            res.status(201).json(task);
        } catch (error) {
            const err = new Error("Internal server error");
            err.status = 500;
            return next(err);
        }
    }
    static async getByStage(req, res, next) {
        try {
            const { stageId } = req.params;
            const tasks = await TaskService.getTasksByStage(stageId);
            if (!tasks || tasks.length === 0) {
                const error = new Error("No tasks found for this stage");
                error.status = 404;
                return next(error);
            }
            res.status(200).json(tasks);
        } catch (error) {
            const err = new Error("Internal server error");
            err.status = 500;
            return next(err);
        }
    }
}
module.exports = TaskController;