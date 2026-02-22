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
    static async getReportSetupData() {
    
    const [trades, safetyMeasures] = await Promise.all([
        Catalog.getTrades(),
        Catalog.getSafetyMeasures()
    ]);
    
    return {
        trades,
        safetyMeasures
    };
}
}
module.exports = CatalogService;