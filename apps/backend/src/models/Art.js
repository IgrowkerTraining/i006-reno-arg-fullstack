const db = require('../config/db');

class Art {
    constructor(artData) {
        this.id = artData.id_art;
        this.catArtId = artData.id_cat_art;
        this.name = artData.nombre_entidad_art;
        this.validFrom = artData.valida_desde;
        this.validTo = artData.valida_hasta;
        this.status = artData.estado_art ?? true;
    }
    static async create(data, t) {
        const sql = `
        INSERT INTO cobertura_art (id_cat_art, valida_desde, valida_hasta, estado_art)
VALUES ($1, CURRENT_DATE, NULL, $2)
RETURNING id_art;
    `;
        const result = await t.one(sql, [
            data.id_cat_art,
            data.estado_art ?? true
        ]);
        return result.id_art;
    }
}
module.exports = Art;