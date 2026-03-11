const db = require('../config/db');
class Report {
    constructor(reportData) {
        this.id = reportData.id || reportData.id_registro_avance;
        this.projectId = reportData.projectId || reportData.id_proyecto;
        this.projectName = reportData.projectName;
        this.date = reportData.date || reportData.fecha;
        this.progressPercentage = parseFloat(reportData.progressPercentage || reportData.avance_porcentaje) || 0;
        this.comment = reportData.comment || reportData.comentario;

        this.supervisor = {
            id: reportData.idSupervisor || reportData.id_supervisor,
            name: reportData.supervisorName
        };

        this.validation = {
           
            id: reportData.validationId || reportData.id_validacion,
            status: reportData.statusName || reportData.estado || 'PENDIENTE',
            validatedAt: reportData.validationDate || reportData.fecha_validacion,
            technicalComment: reportData.technicalComment || reportData.comentario_tecnico
        };
    }

    toJSON() {
        return {
            id: this.id,
            projectId: this.projectId,
            projectName: this.projectName,
            date: this.date,
            progressPercentage: this.progressPercentage,
            comment: this.comment,
            supervisor: this.supervisor,
            validation: this.validation
        };
    }

    /**
     * @param {Object} data 
     * @param {Object} [t]
     */
    static async create(data, t) {
        const { idSupervisor, idProject, progressPercentage, comment } = data;
        const sql = `
            INSERT INTO REGISTRO_AVANCE (id_supervisor, id_proyecto, avance_porcentaje, comentario) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`;

        const connection = t || db;
        const result = await connection.one(sql, [idSupervisor, idProject, progressPercentage || 0, comment]);
        return new Report(result);
    }

    static async saveFullReport(reportData, t) {
        const reportHeader = await this.create(reportData, t);

        await Promise.all([
            this._insertTasks(t, reportHeader.id, reportData.selectedTasks),
            this._insertTrades(t, reportHeader.id, reportData.selectedTrades),
            this._insertSafety(t, reportHeader.id, reportData.safetyItems)
        ]);

        return reportHeader;
    }

    static async getTasksForReport(idProject) {
        const sql = `
            SELECT 
                e.id_etapa as id_stage, 
                te.nombre AS stage_name, 
                t.id_tarea as id_task, 
                tt.nombre AS task_name
            FROM ETAPA e
            JOIN TIPO_ETAPA te ON e.id_tipo_etapa = te.id_tipo_etapa
            JOIN TAREA t ON e.id_etapa = t.id_etapa
            JOIN TIPO_TAREA tt ON t.id_tipo_tarea = tt.id_tipo_tarea
            WHERE e.id_proyecto = $1
            ORDER BY e.id_etapa, t.id_tarea;
        `;
        const rows = await db.any(sql, [idProject]);
        return this._formatTasksByStage(rows);
    }

    static _formatTasksByStage(rows) {
        return rows.reduce((acc, row) => {
            let stage = acc.find(s => s.id_etapa === row.id_stage);

            if (!stage) {
                stage = {
                    id_etapa: row.id_stage,
                    nombre_etapa: row.stage_name,
                    tareas: []
                };
                acc.push(stage);
            }
            if (row.id_task) {
                stage.tareas.push({
                    id_tarea: row.id_task,
                    nombre_tarea: row.task_name
                });
            }
            return acc;
        }, []);
    }
    static async _insertTasks(t, idReport, tasks) {
        if (!tasks || tasks.length === 0) return;
        const queries = tasks.map(idTarea =>
            t.none('INSERT INTO DETALLE_AVANCE_TAREA (id_registro_avance, id_tarea, id_estado_tarea) VALUES ($1, $2, $3)', [idReport, idTarea, 2])
        );
        return t.batch(queries);
    }

    static async _insertTrades(t, idReport, trades) {
        if (!trades || trades.length === 0) return;
        const queries = trades.map(idOficio =>
            t.none('INSERT INTO REGISTRO_OFICIO (id_registro_avance, id_oficio) VALUES ($1, $2)', [idReport, idOficio])
        );
        return t.batch(queries);
    }

    static async _insertSafety(t, idReport, safetyItems) {
        if (!safetyItems || safetyItems.length === 0) return;

        const queries = safetyItems.map(item => {

            return t.none(
                `INSERT INTO registro_seguridad 
                (id_registro_avance, id_medida_seg, cumple) 
             VALUES ($1, $2, $3)`,
                [
                    idReport,
                    item.id_medida_seg,
                    item.cumple ?? true
                ]
            );
        });
        return t.batch(queries);
    }

    static async getAllReports() {
        return await db.any(`
        SELECT 
            r.id_registro_avance as id,
            r.fecha as date,
            p.nombre as project_name,
            u.nombre as supervisor,
            r.avance_porcentaje as progress_percentage,
            r.comentario as comment,
            v.estado as validation_status
        FROM REGISTRO_AVANCE r
        JOIN PROYECTO p ON r.id_proyecto = p.id_proyecto
        JOIN USUARIO u ON r.id_supervisor = u.id_usuario
        LEFT JOIN VALIDACION_TECNICA v ON r.id_registro_avance = v.id_registro_avance
        ORDER BY r.fecha DESC;
    `);
    }
    static async getReportById(id) {
        const report = await db.oneOrNone(`
        SELECT 
    r.id_registro_avance AS reportId,
    r.id_supervisor AS supervisorId,
    r.id_proyecto AS projectId,
    r.fecha AS date,
    r.avance_porcentaje AS progressPercentage,
    r.comentario AS comment,
    p.nombre AS projectName,
    u.nombre AS supervisorName,
    v.id_validacion AS validationId, -- Agregamos el ID solicitado
    v.estado AS validationStatus,
    v.comentario AS technicalComment
FROM REGISTRO_AVANCE r
JOIN PROYECTO p ON r.id_proyecto = p.id_proyecto
JOIN USUARIO u ON r.id_supervisor = u.id_usuario
LEFT JOIN VALIDACION_TECNICA v ON r.id_registro_avance = v.id_registro_avance
WHERE r.id_registro_avance = $1
    `, [id]);

        if (!report) return null;

        report.tasks = await this.getTasksByReportId(id);
        report.trades = await this.getTradesByReportId(id);
        report.safety = await this.getSafetyByReportId(id);

        return report;
    }

    static async getTasksByReportId(id) {
        return await db.any(`
    SELECT 
        tt.nombre as task_name, 
        e.nombre as task_status 
    FROM DETALLE_AVANCE_TAREA det 
    JOIN TAREA t ON det.id_tarea = t.id_tarea -- Primero a la tabla TAREA
    JOIN TIPO_TAREA tt ON t.id_tipo_tarea = tt.id_tipo_tarea -- Luego al catálogo de nombres
    JOIN ESTADO e ON det.id_estado_tarea = e.id_estado
    WHERE det.id_registro_avance = $1`, [id]);
    }

    static async getTradesByReportId(id) {
        return await db.any(`
        SELECT o.nombre as trade_name 
        FROM REGISTRO_OFICIO reg 
        JOIN OFICIO o ON reg.id_oficio = o.id_oficio 
        WHERE reg.id_registro_avance = $1`, [id]);
    }

    static async getSafetyByReportId(id) {
        return await db.any(`
        SELECT m.descripcion as safety_description, reg.cumple as status
        FROM REGISTRO_SEGURIDAD reg 
        JOIN MEDIDAS_SEGURIDAD m ON reg.id_medida_seg = m.id_medidas_seg 
        WHERE reg.id_registro_avance = $1`, [id]);
    }

    static async countAll() {
        const res = await db.one('SELECT COUNT(*) FROM registro_avance');
        return parseInt(res.count);
    }

    static async findByProjectId(projectId) {
        const query = `
   SELECT 
    ra.id_registro_avance as id,
    ra.id_proyecto as "projectId",
    p.nombre as "projectName",
    ra.id_supervisor as "idSupervisor",
    u.nombre as "supervisorName",
    ra.fecha as date,
    ra.avance_porcentaje as "progressPercentage",
    ra.comentario as comment,
    vt.id_validacion as "validationId", -- Agregamos el ID de validación
    COALESCE(vt.estado, 'PENDIENTE') as "statusName",
    vt.fecha_validacion as "validationDate",
    vt.comentario as "technicalComment"
FROM REGISTRO_AVANCE ra
JOIN PROYECTO p ON ra.id_proyecto = p.id_proyecto
JOIN USUARIO u ON ra.id_supervisor = u.id_usuario
LEFT JOIN VALIDACION_TECNICA vt ON ra.id_registro_avance = vt.id_registro_avance
WHERE ra.id_proyecto = $1
ORDER BY ra.fecha DESC
    `;

        const results = await db.any(query, [projectId]);
        return results.map(row => new Report(row));
    }
}

module.exports = Report;
