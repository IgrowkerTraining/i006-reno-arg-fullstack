const ValidationService = require('../services/validationService');

class ValidationController {
    static async getAllValidations(_req, res, next) {
        try {
            const validations = await ValidationService.getAllValidations();
            return res.status(200).json(validations);
        } catch (error) {
            return next(error);
        }
    }
    static async countByStatus(req, res, next) {
        try {
            const { status } = req.params;
            const count = await ValidationService.countByStatus(status);
            return res.status(200).json({ status, count });
        } catch (error) {
            return next(error);
        }
    }
    static async updateValidation(req, res, next) {
    try {
        const { id } = req.params;
        const { status, observations } = req.body;
        const idResponsible = req.user.id; 
        
        const updated = await ValidationService.updateValidation(id, status, observations, idResponsible);
        
        if (!updated) {
            const error = new Error('Validation not found or update failed');
            error.status = 404;
            throw error;
        }
        
        res.status(200).json(updated);
    } catch (error) {
        return next(error);
    }
}
}
module.exports = ValidationController;