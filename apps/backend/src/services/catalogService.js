const Catalog = require('../models/Catalog');

class CatalogService {
  
    static async getProjectSetupData() {
        const [sistemas, planificacion] = await Promise.all([
            Catalog.getSystems(),
            Catalog.getPlanningStructure()
        ]);
        return {
            sistemas,
            planificacion
        };
    }
}
module.exports = CatalogService;