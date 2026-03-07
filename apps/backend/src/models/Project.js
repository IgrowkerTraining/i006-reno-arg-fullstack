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
      SELECT 
            p.id_proyecto,
            p.codigo,
            p.nombre,
            p.ubicacion,
            p.superficie_m2,
            p.fecha_registro,
            p.id_sistema_constructivo,
            p.id_art,
            p.id_responsable,
            u.nombre as responsable_nombre,
            u.matricula as matricula_responsable
        FROM PROYECTO p
        INNER JOIN USUARIO u ON p.id_responsable = u.id_usuario
        ORDER BY p.fecha_registro DESC
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
        id_responsable, id_sistema_constructivo, id_art
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
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
  static async countArtActive() {
    const sql = `
        SELECT 
            COUNT(*)::integer AS total,
            COUNT(id_art)::integer AS with_art
        FROM proyecto;
    `;
    return await db.one(sql);
    console.error("Error countArtActive:", error.message);
  }

  static async getSnapshotDataForAI(projectId, month, year) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const sql = `
    SELECT
      p.codigo AS project_code,
      p.nombre AS project_name,
      u_resp.nombre AS responsible_technician,
      ra.id_registro_avance AS report_id,
      TO_CHAR(ra.fecha, 'DD-MM-YYYY') AS report_date,
      u_sup.nombre AS supervisor_name,
      te.nombre AS stage_name,
      e.progreso AS stage_progress,
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

    const snapshotData = this._formatSnapshotJSON(rows, startDate, endDate);
    return snapshotData;
  

  }
static _formatSnapshotJSON(rows, startDate, endDate) {
    if (!rows || rows.length === 0) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`;
    };

    const fixProjectCode = (code) => {
        const parts = code.split('-');
        const lastPart = parts[parts.length - 1].padStart(3, '0');
        return `RENO-AR-2026-${lastPart}`;
    };

    const reportsMap = new Map();

    rows.forEach(row => {
        if (!reportsMap.has(row.report_id)) {
            reportsMap.set(row.report_id, {
                fecha: formatDate(row.report_date),
                supervisor: row.supervisor_name || "Sin asignar",
                tareas_ejecutadas: new Set(),
                oficios_activos: new Set(),
                porcentaje_avance: row.stage_progress || 0
            });
        }

        const report = reportsMap.get(row.report_id);
        if (row.task_name) report.tareas_ejecutadas.add(row.task_name);
        if (row.trade_name) report.oficios_activos.add(row.trade_name);
    });

    const registrosAvanceArray = Array.from(reportsMap.values()).map(r => ({
        ...r,
        tareas_ejecutadas: r.tareas_ejecutadas.size > 0 ? Array.from(r.tareas_ejecutadas) : ["Sin tareas registradas"],
        oficios_activos: r.oficios_activos.size > 0 ? Array.from(r.oficios_activos) : ["Sin oficios registrados"]
    }));

    const lastRow = rows[rows.length - 1];
    const todasLasMedidas = [...new Set(rows.map(r => r.safety_measure).filter(Boolean))];

    const etapaSegura = lastRow.stage_name || "Etapa General";
    const estadoSeguro = lastRow.validation_status || "PENDIENTE";

    return {
        project: {
            codigo: fixProjectCode(lastRow.project_code),
            nombre: lastRow.project_name || "Proyecto sin nombre",
            responsable_tecnico: lastRow.responsible_technician || "No asignado"
        },
        periodo: {
            desde: startDate,
            hasta: endDate
        },
        etapas: {
            nombre: etapaSegura,
            estado: estadoSeguro,
            avance_estimado: lastRow.stage_progress || 0
        },
        registros_avance: registrosAvanceArray,
        medidas_seguridad: {
            fecha: formatDate(lastRow.report_date),
            implementadas: todasLasMedidas.length > 0 ? todasLasMedidas : ["Uso de EPP básico"],
            cobertura_art: {
                entidad: lastRow.art_name || "No especificada",
                vigencia: lastRow.art_name ? "Activa" : "No disponible"
            }
        },
        validaciones_tecnicas: {
            fecha: formatDate(lastRow.report_date),
            estado: estadoSeguro,
            etapa: etapaSegura,
            responsable: lastRow.responsible_technician || "No asignado"
        }
    };
}
  static _formatMonthlyJSON(rows, start, end) {
    const context = {
      proyecto: {
        codigo: rows[0].project_code,
        nombre: rows[0].project_name,
        responsable_tecnico: rows[0].responsible_technician
      },
      periodo: { desde: start, hasta: end },
      registros_avance: []
    };

    const reportsMap = new Map();

    rows.forEach(row => {
      if (!reportsMap.has(row.report_id)) {
        reportsMap.set(row.report_id, {
          fecha: row.report_date,
          supervisor: row.supervisor_name,
          actividad_por_etapa: [],
          recursos_y_seguridad: {
            oficios_activos: new Set(),
            medidas_seguridad_implementadas: new Set(),
            art_vigente: row.art_name || "No especificada"
          },
          validaciones_tecnicas: []
        });
      }

      const report = reportsMap.get(row.report_id);

      if (row.stage_name) {
        let etapa = report.actividad_por_etapa.find(e => e.etapa === row.stage_name);
        if (!etapa) {
          etapa = { etapa: row.stage_name, tareas_ejecutadas: new Set() };
          report.actividad_por_etapa.push(etapa);
        }
        if (row.task_name) etapa.tareas_ejecutadas.add(row.task_name);
      }

      if (row.trade_name) report.recursos_y_seguridad.oficios_activos.add(row.trade_name);
      if (row.safety_measure) report.recursos_y_seguridad.medidas_seguridad_implementadas.add(row.safety_measure);

      if (row.validation_status) {
        const yaExiste = report.validaciones_tecnicas.some(v => v.comentario_supervisor === row.validation_comment);
        if (!yaExiste) {
          report.validaciones_tecnicas.push({
            etapa_validada: row.stage_name,
            estado: row.validation_status,
            comentario_supervisor: row.validation_comment
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
  static async findByName(name) {
    const query = `
        SELECT * FROM PROYECTO 
        WHERE nombre ILIKE $1
        ORDER BY nombre ASC
    `;
    const params = [`%${name}%`];

    const results = await db.any(query, params);
    return results.map(row => new Project(row));
  }

}

module.exports = Project;