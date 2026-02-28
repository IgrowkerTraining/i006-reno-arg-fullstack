const db = require('../config/db');

class Project {
  constructor(projectData) {
    this.id = projectData.id_proyecto;
    this.code = projectData.codigo;
    this.name = projectData.nombre;
    this.location = projectData.ubicacion;
    this.surfaceM2 = projectData.superficie_m2;
    this.registrationDate = projectData.fecha_registro;
    this.constructionSystemId = projectData.id_sistema_constructivo;
    this.artCoverageId = projectData.id_art;
    this.managerId = projectData.id_responsable;
    this.managerName = projectData.responsable_nombre;
    this.managerLicense = projectData.matricula_responsable;

  }
  toJSON() {
    const json = {
      id: this.id,
      code: this.code,
      name: this.name,
      location: this.location,
      surfaceM2: parseFloat(this.surfaceM2),
      registrationDate: this.registrationDate,
      manager: {
        id: this.managerId,
        name: this.managerName,
        license: this.managerLicense
      },
      config: {
        constructionSystemId: this.constructionSystemId,
        artCoverageId: this.artCoverageId
      }
    };

    if (this.stages && this.stages.length > 0) {
      json.stages = this.stages;
    }

    return json;
  }
  static async getAll() {
    const sql = `
      SELECT p.*, u.nombre as responsable_nombre 
      FROM PROYECTO p
      LEFT JOIN USUARIO u ON p.id_responsable = u.id_usuario
      ORDER BY p.id_proyecto DESC;
    `;
    const projects = await db.any(sql);
    return projects.map(p => new Project(p));
  }
  static async findById(id) {
    const sql = `
      SELECT p.*, u.nombre as responsable_nombre 
      FROM PROYECTO p
      LEFT JOIN USUARIO u ON p.id_responsable = u.id_usuario
      WHERE p.id_proyecto = $1;
    `;
    const project = await db.oneOrNone(sql, [id]);
    return project ? new Project(project) : null;
  }

  static async create(projectData, tx) {
    const connection = tx || db;

    const sql = `
      INSERT INTO PROYECTO (
        codigo, nombre, ubicacion, superficie_m2, 
        id_responsable, id_sistema_constructivo, id_art, matricula_responsable
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const params = [
      projectData.codigo,
      projectData.nombre,
      projectData.ubicacion,
      projectData.superficie_m2,
      projectData.id_responsable,
      projectData.id_sistema_constructivo,
      projectData.id_art || null,
      projectData.matricula_responsable
    ];

    const result = await connection.one(sql, params);
    return new Project(result);
  }
  static async updateArt(artCoverageId, projectId) {
    const sql = `
      UPDATE PROYECTO 
      SET id_art = $1 
      WHERE id_proyecto = $2 
      RETURNING *;
    `;
    const result = await db.oneOrNone(sql, [artCoverageId, projectId]);
    return result ? new Project(result) : null;
  }

  static async updateCode(id, generatedCode, t) {
    const sql = `
        UPDATE PROYECTO 
        SET codigo = $1 
        WHERE id_proyecto = $2 
        RETURNING *
    `;
    const executor = t || db;
    return await executor.one(sql, [generatedCode, id]);
  }

  static async getProjectsByUserId(userId) {
    const sql = `
      SELECT p.*, u.nombre as responsable_nombre 
      FROM PROYECTO p
      INNER JOIN USUARIO u ON p.id_responsable = u.id_usuario
      WHERE p.id_responsable = $1;
    `;
    const rows = await db.any(sql, [userId]);

    return rows.map(row => new Project(row));
  }

  static async getDataProjectReport(projectId, month, year) {
    return await db.any(`
        SELECT 
            TO_CHAR(r.fecha, 'YYYY-MM-DD') AS report_date,
            r.avance_porcentaje AS progress,
            r.comentario AS supervisor_notes,
            (SELECT string_agg(t.nombre, ', ') 
             FROM DETALLE_AVANCE_TAREA det 
             JOIN tipo_tarea t ON det.id_tarea = t.id_tipo_tarea 
             WHERE det.id_registro_avance = r.id_registro_avance) AS tasks,
            (SELECT string_agg(o.nombre, ', ') 
             FROM REGISTRO_OFICIO reg 
             JOIN OFICIO o ON reg.id_oficio = o.id_oficio 
             WHERE reg.id_registro_avance = r.id_registro_avance) AS trades,
            (SELECT string_agg(m.descripcion || ': ' || (CASE WHEN rs.cumple THEN 'Cumple' ELSE 'No Cumple' END), ' | ') 
             FROM REGISTRO_SEGURIDAD rs 
             JOIN MEDIDAS_SEGURIDAD m ON rs.id_medida_seg = m.id_medidas_seg 
             WHERE rs.id_registro_avance = r.id_registro_avance) AS safety_status
        FROM REGISTRO_AVANCE r
        WHERE r.id_proyecto = $1 
          AND EXTRACT(MONTH FROM r.fecha) = $2
          AND EXTRACT(YEAR FROM r.fecha) = $3
        ORDER BY r.fecha ASC
    `, [projectId, month, year]);
  }

  static async getProjectHeader(projectId) {
    return await db.oneOrNone(`
        SELECT 
    p.id_proyecto, 
    p.nombre AS proyecto_nombre, 
    TO_CHAR(p.fecha_registro, 'YYYY-MM-DD') AS fecha_registro,
    ca.nombre_entidad_art AS nombre_art, -- Ahora viene de 'ca' (CAT_ART)
    u.nombre AS creador_nombre,
    r.nombre AS creador_rol_nombre,
    u.id_rol AS creador_rol_id
FROM PROYECTO p
JOIN USUARIO u ON p.id_responsable = u.id_usuario
LEFT JOIN COBERTURA_ART c ON p.id_art = c.id_art
LEFT JOIN CAT_ART ca ON c.id_cat_art = ca.id_cat_art -- El nuevo JOIN necesario
LEFT JOIN ROL r ON u.id_rol = r.id_rol
WHERE p.id_proyecto = $1
    `, [projectId]);
  }

  static async countAll() {
    const res = await db.one('SELECT COUNT(*) FROM PROYECTO');
    return parseInt(res.count);
}

static async getMonthlyDataForAI(projectId, month, year) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const sql = `
        SELECT 
            p.codigo AS project_code, 
            p.nombre AS project_name,
            u_resp.nombre AS responsible_technician,
            ra.id_registro_avance AS report_id,
            ra.fecha AS report_date,
            u_sup.nombre AS supervisor_name,
            te.nombre AS stage_name,
            tt.nombre AS task_name,
            o.nombre AS trade_name,
            ms.descripcion AS safety_measure,
            ca.nombre_entidad_art AS art_name,
            vt.estado AS validation_status,
            vt.comentario AS validation_comment
        FROM proyecto p
        JOIN usuario u_resp ON p.id_responsable = u_resp.id_usuario
        JOIN registro_avance ra ON p.id_proyecto = ra.id_proyecto
        JOIN usuario u_sup ON ra.id_supervisor = u_sup.id_usuario
        LEFT JOIN detalle_avance_tarea dat ON ra.id_registro_avance = dat.id_registro_avance
        LEFT JOIN tarea t ON dat.id_avance_tarea = t.id_tarea
        LEFT JOIN tipo_tarea tt ON t.id_tipo_tarea = tt.id_tipo_tarea
        LEFT JOIN etapa e ON t.id_etapa = e.id_etapa
        LEFT JOIN tipo_etapa te ON e.id_tipo_etapa = te.id_tipo_etapa
        LEFT JOIN registro_oficio ro ON ra.id_registro_avance = ro.id_reg_oficio
        LEFT JOIN oficio o ON ro.id_oficio = o.id_oficio
        LEFT JOIN registro_seguridad rs ON ra.id_registro_avance = rs.id_registro_avance
        LEFT JOIN medidas_seguridad ms ON rs.id_medida_seg = ms.id_medidas_seg
        LEFT JOIN cat_art ca ON p.id_art = ca.id_cat_art
        LEFT JOIN validacion_tecnica vt ON ra.id_registro_avance = vt.id_registro_avance
        WHERE p.id_proyecto = $1 
          AND ra.fecha BETWEEN $2 AND $3
        ORDER BY ra.fecha ASC, te.nombre ASC;
    `;

    const rows = await db.any(sql, [projectId, startDate, endDate]);
    
    if (!rows || rows.length === 0) return null;

    return this._formatMonthlyJSON(rows, startDate, endDate);
}

static _formatMonthlyJSON(rows, start, end) {
    const context = {
        proyecto: {
            codigo: rows[0].proyecto_codigo,
            nombre: rows[0].proyecto_nombre,
            responsable_tecnico: rows[0].responsable_tecnico
        },
        periodo: { desde: start, hasta: end },
        registros_avance: []
    };

    const reportsMap = new Map();

    rows.forEach(row => {
        if (!reportsMap.has(row.id_reporte)) {
            reportsMap.set(row.id_reporte, {
                fecha: row.fecha,
                supervisor: row.supervisor_nombre,
                actividad_por_etapa: [],
                recursos_y_seguridad: {
                    oficios_activos: new Set(),
                    medidas_seguridad_implementadas: new Set(),
                    art_vigente: row.art_nombre || "No especificada"
                },
                validaciones_tecnicas: []
            });
        }

        const report = reportsMap.get(row.id_reporte);

        if (row.etapa_nombre) {
            let etapa = report.actividad_por_etapa.find(e => e.etapa === row.etapa_nombre);
            if (!etapa) {
                etapa = { etapa: row.etapa_nombre, tareas_ejecutadas: new Set() };
                report.actividad_por_etapa.push(etapa);
            }
            etapa.tareas_ejecutadas.add(row.tarea_nombre);
        }

        if (row.oficio_nombre) report.recursos_y_seguridad.oficios_activos.add(row.oficio_nombre);
        if (row.medida_seguridad) report.recursos_y_seguridad.medidas_seguridad_implementadas.add(row.medida_seguridad);

        if (row.validacion_estado) {
            const yaExiste = report.validaciones_tecnicas.some(v => v.comentario_supervisor === row.validacion_comentario);
            if (!yaExiste) {
                report.validaciones_tecnicas.push({
                    etapa_validada: row.etapa_nombre,
                    estado: row.validacion_estado,
                    comentario_supervisor: row.validacion_comentario
                });
            }
        }
    });

    context.registros_avance = Array.from(reportsMap.values()).map(r => ({
        ...r,
        actividad_por_etapa: r.actividad_por_etapa.map(e => ({
            ...e,
            tareas_ejecutadas: Array.from(e.tareas_ejecutadas)
        })),
        recursos_y_seguridad: {
            ...r.recursos_y_seguridad,
            oficios_activos: Array.from(r.recursos_y_seguridad.oficios_activos),
            medidas_seguridad_implementadas: Array.from(r.recursos_y_seguridad.medidas_seguridad_implementadas)
        }
    }));

    return context;
}

}

module.exports = Project;