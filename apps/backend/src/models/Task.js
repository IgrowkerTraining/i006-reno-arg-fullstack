const db = require('../config/db');

class Task {
    constructor(data) {
        this.id = data.id_tarea;
        this.stageId = data.id_etapa;
        this.typeTaskId = data.id_tipo_tarea;
        this.statusId = data.id_estado;
        this.startDate = data.fecha_inicio;
        this.endDate = data.fecha_fin;   
        this.typeName = data.tipo_tarea_nombre; 
        this.statusName = data.estado_nombre;
    }
    static async create(taskData, tx) {
    const connection = tx || db;

    const sql = `
        INSERT INTO TAREA (id_etapa, id_tipo_tarea, id_estado)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const params = [
        taskData.stageId,
        taskData.typeTaskId,
        taskData.statusId || 1
    ];

    const result = await connection.one(sql, params);
    return new Task(result);
}
    static async findByStageId(stageId) {
    const sql = `
        SELECT 
            t.*, 
            tt.nombre AS tipo_tarea_nombre,
            es.nombre AS estado_nombre      
        FROM TAREA t
        JOIN TIPO_TAREA tt ON t.id_tipo_tarea = tt.id_tipo_tarea
        JOIN ESTADO es ON t.id_estado = es.id_estado
        WHERE t.id_etapa = $1
        ORDER BY t.id_tarea ASC;
    `;
    const results = await db.any(sql, [stageId]);
    return results.map(row => new Task(row));
}
}

module.exports = Task;