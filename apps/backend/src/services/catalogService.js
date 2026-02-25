const Catalog = require('../models/Catalog');

class CatalogService {
  
    static async getProjectSetupData() {
        const [systems, planningStructure, artsCoverage] = await Promise.all([
            Catalog.getSystems(),
            Catalog.getPlanningStructure(),
            Catalog.getArts()
        ]);
        return {
            systems,
            planningStructure,
            artsCoverage
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