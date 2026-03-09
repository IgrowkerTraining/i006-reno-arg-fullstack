const Art = require('../models/Art');


class ArtService {
    /**
  
     * @param {Object} artData 
     * @param {Object} t
     */
    static async createArtCoverage(artData, t) {
        try {
            
            if (!artData.id_cat_art) {
                throw new Error("ID art is required (catalog)");
            }
            const newArtId = await Art.create(artData, t);

            return newArtId;
        } catch (error) {
            console.error("Error en ArtService.createArtCoverage:", error.message);
            throw error;
        }
    }
    static async getCatalog() {
        return await Art.getEntries();
    }
}

module.exports = ArtService;