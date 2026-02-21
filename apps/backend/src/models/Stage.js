const db = require('../config/db');

class Stage {
    constructor(data) {
        this.id = data.id_etapa;
        this.projectId = data.id_proyecto;
        this.typeStageId = data.id_tipo_etapa;
        this.startDate = data.fecha_inicio;
        this.endDate = data.fecha_fin;
        this.statusId = data.id_estado;
    }
    static async create(stageData, tx) {
        const connection = tx || db;

        const sql = `
        INSERT INTO ETAPA (id_proyecto, id_tipo_etapa, fecha_inicio, id_estado)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

        const params = [
            stageData.projectId,
            stageData.typeStageId,
            stageData.startDate || new Date(),
            stageData.statusId || 1
        ];

        const result = await connection.one(sql, params);
        return new Stage(result);
    }
    static async findByProjectId(projectId) {
        const sql = `
        SELECT 
            e.*, 
            te.nombre AS tipo_nombre, 
            es.nombre AS estado_nombre
        FROM ETAPA e
        JOIN TIPO_ETAPA te ON e.id_tipo_etapa = te.id_tipo_etapa
        JOIN ESTADO es ON e.id_estado = es.id_estado
        WHERE e.id_proyecto = $1
        ORDER BY te.id_tipo_etapa ASC;
    `;

        const results = await db.any(sql, [projectId]);

        return results.map(row => {
            const stage = new Stage(row);
            stage.typeName = row.tipo_nombre;
            stage.statusName = row.estado_nombre;
            return stage;
        });
    }
}

module.exports = Stage;