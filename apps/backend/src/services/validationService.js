const Validation = require('../models/Validation');

class ValidationService {
    static async getAllValidations() {
        return await Validation.getAllValidations();
    }
    static async updateValidation(id, status, comment, idResponsible) {
        const result = await Validation.updateStatus(id, status, comment, idResponsible);
        return result;
    }
}
module.exports = ValidationService;