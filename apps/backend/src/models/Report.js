const db = require('../config/db');
class Report {
    constructor(reportData) {
        this.id = reportData.id || reportData.id_registro_avance;
        this.projectId = reportData.projectId || reportData.id_proyecto;
        this.projectName = reportData.projectName;
        this.date = reportData.date || reportData.fecha;
        this.progressPercentage = Math.round(parseFloat(reportData.progressPercentage || reportData.avance_porcentaje) || 0); this.comment = reportData.comment || reportData.comentario;
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
            e.id_etapa AS id_stage, 
            te.nombre AS stage_name, 
            t.id_tarea AS id_task, 
            tt.nombre AS task_name,
            t.id_estado AS id_status,
            est.nombre AS status_name
        FROM ETAPA e
        JOIN TIPO_ETAPA te ON e.id_tipo_etapa = te.id_tipo_etapa
        JOIN TAREA t ON e.id_etapa = t.id_etapa
        JOIN TIPO_TAREA tt ON t.id_tipo_tarea = tt.id_tipo_tarea
        JOIN ESTADO est ON t.id_estado = est.id_estado
        WHERE e.id_proyecto = $1
        ORDER BY e.id_etapa, t.id_tarea;
        `;
        const rows = await db.any(sql, [idProject]);
        return this._formatTasksByStage(rows);
    }

    static _formatTasksByStage(rows) {
        const stagesMap = new Map();

        rows.forEach(row => {
            if (!stagesMap.has(row.id_stage)) {
                stagesMap.set(row.id_stage, {
                    id_stage: row.id_stage,
                    stage_name: row.stage_name,
                    tasks: []
                });
            }
            stagesMap.get(row.id_stage).tasks.push({
                id_task: row.id_task,
                task_name: row.task_name,
                id_status: row.id_status,
                status_name: row.status_name
            });
        });
        return Array.from(stagesMap.values());
    }
    static async _insertTasks(t, idReport, tasks) {
        if (!tasks || tasks.length === 0) return;
        const queries = tasks.map(idTarea =>
            t.none('INSERT INTO DETALLE_AVANCE_TAREA (id_registro_avance, id_tarea, id_estado_tarea) VALUES ($1, $2, $3)', [idReport, idTarea, 3])
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
    r.id_registro_avance AS id,
    TO_CHAR(r.fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD') AS date,
    p.nombre AS project_name,
    p.ubicacion AS address_project,
    MAX(te.nombre) AS stage_name, 
    string_agg(tt.nombre, ', ') AS task_name, 
    u.nombre AS supervisor,
    r.avance_porcentaje AS progress_percentage,
    COALESCE(NULLIF(r.comentario, ''), 'Sin observaciones') AS comment,
    v.estado AS validation_status
FROM REGISTRO_AVANCE r
JOIN PROYECTO p ON r.id_proyecto = p.id_proyecto
JOIN USUARIO u ON r.id_supervisor = u.id_usuario
JOIN detalle_avance_tarea rat ON r.id_registro_avance = rat.id_registro_avance
JOIN TAREA t ON rat.id_tarea = t.id_tarea
JOIN TIPO_TAREA tt ON t.id_tipo_tarea = tt.id_tipo_tarea
JOIN ETAPA e ON t.id_etapa = e.id_etapa
JOIN TIPO_ETAPA te ON e.id_tipo_etapa = te.id_tipo_etapa
LEFT JOIN VALIDACION_TECNICA v ON r.id_registro_avance = v.id_registro_avance
GROUP BY 
    r.id_registro_avance, 
    r.fecha,
    p.nombre, 
    p.ubicacion, 
    u.nombre, 
    r.avance_porcentaje, 
    r.comentario, 
    v.estado
ORDER BY r.fecha DESC;
    `);
    }
    static async getReportById(id) {
        const report = await db.oneOrNone(`
        SELECT 
    r.id_registro_avance AS reportId,
    r.id_supervisor AS supervisorId,
    r.id_proyecto AS projectId,
    TO_CHAR(r.fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD') AS date,
    r.avance_porcentaje AS progressPercentage,
    r.comentario AS comment,
    p.nombre AS projectName,
    u.nombre AS supervisorName,
    v.id_validacion AS validationId,
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
    JOIN TAREA t ON det.id_tarea = t.id_tarea 
    JOIN TIPO_TAREA tt ON t.id_tipo_tarea = tt.id_tipo_tarea
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
    (ra.fecha AT TIME ZONE 'America/Argentina/Buenos_Aires')::date AS date,
    ra.avance_porcentaje as "progressPercentage",
    ra.comentario as comment,
    vt.id_validacion as "validationId",
    COALESCE(vt.estado, 'PENDIENTE') as "statusName",
    vt.fecha_validacion AS "validationDate",
    vt.comentario as "technicalComment"
FROM REGISTRO_AVANCE ra
JOIN PROYECTO p ON ra.id_proyecto = p.id_proyecto
JOIN USUARIO u ON ra.id_supervisor = u.id_usuario
LEFT JOIN VALIDACION_TECNICA vt ON ra.id_registro_avance = vt.id_registro_avance
WHERE ra.id_proyecto = $1
ORDER BY ra.fecha DESC, ra.id_registro_avance DESC;
    `;

        const results = await db.any(query, [projectId]);
        return results.map(row => new Report(row));
    }

    static async updateProgress(t, reportId, progress) {
        const sql = `
        UPDATE REGISTRO_AVANCE 
        SET avance_porcentaje = $1 
        WHERE id_registro_avance = $2
    `;
        return await t.none(sql, [progress, reportId]);
    }
}
module.exports = Report;
