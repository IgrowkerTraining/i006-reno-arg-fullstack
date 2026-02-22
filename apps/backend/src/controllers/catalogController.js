const CatalogService = require('../services/catalogService');

class CatalogController {
    static async getPlanningCatalog(req, res, next) {
        try {
            const catalog = await CatalogService.getProjectSetupData();
            
            if (!catalog || (catalog.sistemas.length === 0 && catalog.planificacion.length === 0)) {
                const error = new Error('Catalog not found');
                error.status = 404;
                return next(error);
            }

            return res.status(200).json(catalog);
        } catch (error) {
            return next(error);
        }
    }
    static async getReportCatalog(req, res, next) {
        try {
            const catalog = await CatalogService.getReportSetupData();
            
            if (!catalog || (catalog.trades.length === 0 && catalog.safetyMeasures.length === 0)) {
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