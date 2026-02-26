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
}
module.exports = ValidationController;