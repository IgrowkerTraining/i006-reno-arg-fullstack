const Catalog = require('../models/Catalog');

class CatalogService {
    static async getPlanningCatalog() {
        return await Catalog.getPlanningStructure();
    }
}

module.exports = CatalogService;