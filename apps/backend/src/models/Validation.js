const { stat } = require('fs');
const db = require('../config/db');

class Validation {
    constructor({ id_validacion, id_registro_avance, id_responsable, fecha_validacion, estado, comentario }) {
        this.id = id_validacion;
        this.idProgress = id_registro_avance;
        this.idResponsible = id_responsable;
        this.dateValidation = fecha_validacion;
        this.status = estado;
        this.comment = comentario;
    }
    static async create(t, idReport) {
        return t.none(`
        INSERT INTO VALIDACION_TECNICA (id_registro_avance, estado)
        VALUES ($1, 'PENDIENTE')`,
            [idReport]
        );
    }
    static async getAllValidations() {
        const res = await db.manyOrNone('SELECT * FROM VALIDACION_TECNICA');
        return res.map(row => new Validation(row));
    }
    static async countByStatus(status) {
        const res = await db.one(
            'SELECT COUNT(*) FROM VALIDACION_TECNICA WHERE estado = $1',
            [status.toUpperCase()]
        );
        return parseInt(res.count);
    }
    static async updateStatus(id, status, comment, idResponsible) {
        const sql = `
        UPDATE VALIDACION_TECNICA 
        SET estado = $1, 
            comentario = $2, 
            id_responsable_tecnico = $3, 
            fecha_validacion = CURRENT_TIMESTAMP 
        WHERE id_validacion = $4 
        RETURNING *`;

        const res = await db.oneOrNone(sql, [status, comment, idResponsible, id]);
        return res ? new Validation(res) : null;
    }


}
module.exports = Validation;
