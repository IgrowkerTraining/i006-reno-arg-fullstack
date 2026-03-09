const db = require('../config/db');

class AnalysisIA {
    constructor(data) {
        this.id = data.id_analisis;
        this.projectId = data.id_proyecto;
        this.createdAt = data.fecha;
        const content = data.contenido_json;

        if (content && content.resultado && content.resultado.Proyecto) {
            content.resultado.Proyecto.Direccion = data.ubicacion;
        }
        this.content = content;

    }
    static async save(projectId, analysisData) {
        const result = await db.one(`
            INSERT INTO ANALISIS_IA (id_proyecto, contenido_json)
            VALUES ($1, $2)
            RETURNING id_analisis, id_proyecto, fecha, contenido_json
        `, [projectId, analysisData]);

        return new AnalysisIA(result);
    }
static async findAllByProject(projectId) {
    const sql = `
        SELECT 
            a.id_analisis AS id_analisis,
            a.id_proyecto, 
            a.fecha, 
            a.contenido_json, 
            p.ubicacion 
        FROM ANALISIS_IA a
        INNER JOIN PROYECTO p ON a.id_proyecto = p.id_proyecto
        WHERE a.id_proyecto = $1 
        ORDER BY a.fecha DESC
    `;
    
    const results = await db.any(sql, [projectId]);
    return results.map(row => new AnalysisIA(row));
}   

    static async findById(id) {
        const result = await db.oneOrNone(`
        SELECT * FROM ANALISIS_IA 
        WHERE id_analisis = $1
    `, [id]);
        return result ? new AnalysisIA(result) : null;
    }
static async getAllAnalysis() {
    const results = await db.any(`SELECT * FROM ANALISIS_IA ORDER BY fecha DESC`);
    
    if (!results) return [];

    return results.map(row => new AnalysisIA(row));
}
static async findById(id) {
    const result = await db.oneOrNone(`
        SELECT * FROM ANALISIS_IA 
        WHERE id_analisis = $1
    `, [id]);
    
    return result ? new AnalysisIA(result) : null;
}
}

module.exports = AnalysisIA;