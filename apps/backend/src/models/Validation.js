const { stat } = require('fs');
const db = require('../config/db');

class Validation {
    constructor(data) {
    this.id = data.id || data.id_validacion;
    this.idRegistroAvance = data.idRegistroAvance || data.id_registro_avance;
    this.idResponsableTecnico = data.idResponsableTecnico || data.id_responsable_tecnico;
    this.nombreResponsable = data.nombreResponsable || data.nombre_responsable || null;
    
    this.fechaCreacion = data.fechaCreacion || data.fecha_creacion;
    this.fechaValidacion = data.fechaValidacion || data.fecha_validacion;
    this.estado = data.estado;
    this.comentario = data.comentario;
  }

  toJSON() {
    return {
      id: this.id,
      idRegistroAvance: this.idRegistroAvance,
      responsable: {
        id: this.idResponsableTecnico,
        name: this.nombreResponsable
      },
      fechaCreacion: this.fechaCreacion,
      fechaValidacion: this.fechaValidacion,
      estado: this.estado,
      comentario: this.comentario
    };
  }
    static async create(t, idReport) {
        return t.none(`
        INSERT INTO VALIDACION_TECNICA (id_registro_avance, estado)
        VALUES ($1, 'PENDIENTE')`,
            [idReport]
        );
    }
    static async getAllValidations() {
    const sql = `
        SELECT 
            v.id_validacion AS id,
            v.id_registro_avance AS "idRegistroAvance",
            v.id_responsable_tecnico AS "idResponsableTecnico",
            u.nombre AS "nombreResponsable",
            TO_CHAR(v.fecha_creacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'DD/MM/YYYY HH24:MI') AS "fechaCreacion",
            TO_CHAR(v.fecha_validacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'DD/MM/YYYY HH24:MI') AS "fechaValidacion",
            v.estado,
            v.comentario
        FROM VALIDACION_TECNICA v
        LEFT JOIN USUARIO u ON v.id_responsable_tecnico = u.id_usuario
        ORDER BY v.fecha_creacion DESC;
    `;  
    try {
        const res = await db.manyOrNone(sql);
        
        return res.map(row => new Validation(row));
    } catch (error) {
        console.error("Error en getAllValidations:", error.message);
        throw error;
    }
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
