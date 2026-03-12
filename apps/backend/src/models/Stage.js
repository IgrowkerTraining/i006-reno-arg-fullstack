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

    static async checkAndCloseStage(t, id_etapa) {
        const sqlCheck = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN id_estado = 3 THEN 1 ELSE 0 END) as terminadas
        FROM TAREA
        WHERE id_etapa = $1
    `;
        const result = await t.one(sqlCheck, [id_etapa]);
        const total = parseInt(result.total);
        const terminadas = parseInt(result.terminadas);

        if (total === terminadas && total > 0) {
            const sqlUpdate = `
            UPDATE ETAPA 
            SET id_estado = 3,    
                progreso = 100,       
                fecha_fin = CURRENT_DATE
            WHERE id_etapa = $1
        `;
            await t.none(sqlUpdate, [id_etapa]);
        } else {
            const progreso = Math.round((terminadas / total) * 100);
            await t.none('UPDATE ETAPA SET progreso = $1 WHERE id_etapa = $2', [progreso, id_etapa]);
        }
    }

    static async getProjectProgress(t, id_proyecto) {
        const sql = `
        SELECT ROUND(AVG(progreso), 2) as actual_progress
        FROM ETAPA 
        WHERE id_proyecto = $1
    `;
        const result = await t.one(sql, [id_proyecto]);
        return result.actual_progress;
    }
}

module.exports = Stage;