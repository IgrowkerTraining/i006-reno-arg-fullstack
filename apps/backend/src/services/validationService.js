const Validation = require('../models/Validation');

class ValidationService {
    static async getAllValidations() {
        return await Validation.getAllValidations();
    }
}
module.exports = ValidationService;