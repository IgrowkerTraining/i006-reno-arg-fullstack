const db = require('../config/db');

class AnalysisIA {
    constructor({ id_analisis, id_proyecto, fecha, contenido_json }) {
        this.id = id_analisis;
        this.projectId = id_proyecto;
        this.createdAt = fecha;
        this.content = contenido_json;
    }
    static async save(projectId, analysisData) {
        const result = await db.one(`
            INSERT INTO ANALISIS_IA (id_proyecto, contenido_json)
            VALUES ($1, $2)
            RETURNING id_analisis, id_proyecto, fecha, contenido_json
        `, [projectId, analysisData]);

        return new AnalysisIA(result);
    }
    static async getLastByProject(projectId) {
        const result = await db.oneOrNone(`
            SELECT id_analisis, id_proyecto, fecha, contenido_json
            FROM ANALISIS_IA
            WHERE id_proyecto = $1
            ORDER BY fecha DESC
            LIMIT 1
        `, [projectId]);

        return result ? new AnalysisIA(result) : null;
    }
}

module.exports = AnalysisIA;