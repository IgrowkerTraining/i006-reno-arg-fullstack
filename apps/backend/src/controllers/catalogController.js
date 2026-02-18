const CatalogService = require('../services/catalogService');

class CatalogController {
    static async getPlanningCatalog(req, res, next) {
        try {
            const catalog = await CatalogService.getPlanningCatalog();
            
            if (!catalog || catalog.length === 0) {
                const error = new Error('Catalog not found');
                error.status = 404;
                return next(error);
            }

            return res.status(200).json(catalog);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = CatalogController;