const db = require('../config/db');

class Project {
 constructor(data) {
    this.id = data.id;
    this.code = data.code;
    this.name = data.name;
    this.location = data.location;
    this.surfaceM2 = parseFloat(data.surfaceM2) || 0;
    this.registrationDate = data.registrationDate;
    this.progress = parseFloat(data.projectProgress || data.project_progress || data.progress || 0);
    this.safetyMetrics = data.safetyMetrics || null;

    this.manager = data.manager || {
      id: data.idResponsable,
      name: data.managerName,
      license: data.managerLicense
    };

    this.config = data.config || {
      constructionSystemId: data.idSistemaConstructivo,
      constructionSystemName: data.constructionSystemName,
      artCoverageId: data.idArt,
      artName: data.artName
    };

    this.stages = (data.stages || []).map(stage => ({
      ...stage,
      tasks: stage.tasks || [] 
    }));
}

toJSON() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      location: this.location,
      surfaceM2: this.surfaceM2,
      registrationDate: this.registrationDate,
      progress: this.progress,
      safetyMetrics: this.safetyMetrics,
      manager: this.manager,
      config: this.config,
      stages: this.stages 
    };
  }

  static async getAll() {
    const sql = `
      SELECT 
    p.id_proyecto as id,
    p.codigo as code,
    p.nombre as name,
    p.ubicacion as location,
    p.superficie_m2 as "surfaceM2",
    TO_CHAR(p.fecha_registro AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD') as "registrationDate",
    COALESCE(
        (SELECT ROUND(AVG(progreso), 2) 
         FROM ETAPA 
         WHERE id_proyecto = p.id_proyecto), 
    0) as "projectProgress",
    json_build_object('id', u.id_usuario, 'name', u.nombre, 'license', u.matricula) as manager,
    json_build_object(
        'constructionSystemId', p.id_sistema_constructivo,
        'constructionSystemName', sc.nombre,
        'artCoverageId', p.id_art,
        'artName', ca.nombre_entidad_art
    ) as config,
    (
        SELECT json_build_object(
            'lastReportId', ra.id_registro_avance,
            'safeCount', COUNT(CASE WHEN rs.cumple = true THEN 1 END),
            'unsafeCount', COUNT(CASE WHEN rs.cumple = false THEN 1 END),
            'status', CASE 
                WHEN COUNT(CASE WHEN rs.cumple = false THEN 1 END) > 0 THEN 'NO CUMPLE'
                WHEN COUNT(CASE WHEN rs.cumple = true THEN 1 END) > 0 THEN 'CUMPLE'
                ELSE 'PENDIENTE'
            END
        )
        FROM REGISTRO_AVANCE ra
        LEFT JOIN REGISTRO_SEGURIDAD rs ON ra.id_registro_avance = rs.id_registro_avance
        WHERE ra.id_proyecto = p.id_proyecto
        GROUP BY ra.id_registro_avance, ra.fecha
        ORDER BY ra.fecha DESC, ra.id_registro_avance DESC
        LIMIT 1
    ) as "safetyMetrics"

FROM PROYECTO p
LEFT JOIN USUARIO u ON p.id_responsable = u.id_usuario
LEFT JOIN SISTEMA_CONSTRUCTIVO sc ON p.id_sistema_constructivo = sc.id_sistema
LEFT JOIN cobertura_art co ON p.id_art = co.id_art
LEFT JOIN CAT_ART ca ON co.id_cat_art = ca.id_cat_art
ORDER BY p.id_proyecto DESC;
    `;

    const results = await db.any(sql);
    return results.map(row => new Project(row));
}
static async findById(id) {
    const sql = `
      SELECT 
        p.id_proyecto as id,
        p.codigo as code,
        p.nombre as name,
        p.ubicacion as location,
        p.superficie_m2 as "surfaceM2",
        TO_CHAR(p.fecha_registro AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD') as "registrationDate",
        COALESCE(
          (SELECT ROUND(AVG(progreso), 2) 
           FROM ETAPA 
           WHERE id_proyecto = p.id_proyecto), 
        0) as "projectProgress",

        json_build_object(
          'id', u.id_usuario,
          'name', u.nombre,
          'license', u.matricula
        ) as manager,
        json_build_object(
          'constructionSystemId', p.id_sistema_constructivo,
          'constructionSystemName', sc.nombre,
          'artCoverageId', p.id_art,
          'artName', ca.nombre_entidad_art
        ) as config,
        COALESCE(
          (SELECT json_agg(etapa_data)
           FROM (
             SELECT 
               e.id_etapa as id,
               e.id_proyecto as "projectId",
               e.progreso as progreso,
               e.id_tipo_etapa as "typeStageId",
               TO_CHAR(e.fecha_inicio AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD') as "startDate",
               TO_CHAR(e.fecha_fin AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD') as "endDate",
               e.id_estado as "statusId",
               te.nombre as "typeName",
               es.nombre as "statusName",             
               COALESCE(
                 (SELECT json_agg(tarea_data)
                  FROM (
                    SELECT 
                      t.id_tarea as id,
                      t.id_etapa as "stageId",
                      t.id_tipo_tarea as "typeTaskId",
                      t.id_estado as "statusId",
                      tt.nombre as "typeName",
                      est.nombre as "statusName"
                    FROM TAREA t
                    JOIN TIPO_TAREA tt ON t.id_tipo_tarea = tt.id_tipo_tarea
                    JOIN ESTADO est ON t.id_estado = est.id_estado
                    WHERE t.id_etapa = e.id_etapa
                    ORDER BY t.id_tarea ASC
                  ) tarea_data), 
                 '[]'::json
               ) as tasks
             FROM ETAPA e
             JOIN TIPO_ETAPA te ON e.id_tipo_etapa = te.id_tipo_etapa
             JOIN ESTADO es ON e.id_estado = es.id_estado
             WHERE e.id_proyecto = p.id_proyecto
             ORDER BY e.id_etapa ASC
           ) etapa_data),
          '[]'::json
        ) as stages
      FROM PROYECTO p
      LEFT JOIN USUARIO u ON p.id_responsable = u.id_usuario
      LEFT JOIN SISTEMA_CONSTRUCTIVO sc ON p.id_sistema_constructivo = sc.id_sistema
      LEFT JOIN COBERTURA_ART co ON p.id_art = co.id_art
      LEFT JOIN CAT_ART ca ON co.id_cat_art = ca.id_cat_art
      WHERE p.id_proyecto = $1;
    `;
    try {
        const project = await db.oneOrNone(sql, [id]);
        return project ? new Project(project) : null;
    } catch (error) {
        console.error("Error en findById:", error.message);
        throw error;
    }
}
  static async create(projectData, tx) {
    const connection = tx || db;

    const sql = `
      INSERT INTO PROYECTO (
        nombre, 
        ubicacion, 
        superficie_m2, 
        id_responsable, 
        id_sistema_constructivo, 
        id_art,
        codigo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id_proyecto AS id, 
        codigo AS code, 
        nombre AS name, 
        ubicacion AS location, 
        superficie_m2 AS "surfaceM2",
        fecha_registro AS "registrationDate",
        id_responsable AS "idResponsable",
        id_sistema_constructivo AS "idSistemaConstructivo",
        id_art AS "idArt";
    `;

    const params = [
      projectData.nombre,
      projectData.ubicacion,
      parseFloat(projectData.superficie_m2),
      parseInt(projectData.id_responsable),
      parseInt(projectData.id_sistema_constructivo),
      projectData.id_art || null,
      'TEMP-' + Date.now()
    ];

    try {
      const result = await connection.one(sql, params);
      return new Project(result);
    } catch (error) {
      console.error("error insert project:", error.message);
      throw error;
    }
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
            TO_CHAR(r.fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD') AS report_date,
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
    TO_CHAR(p.fecha_registro AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'YYYY-MM-DD') AS fecha_registro,
    ca.nombre_entidad_art AS nombre_art,
    u.nombre AS creador_nombre,
    r.nombre AS creador_rol_nombre,
    u.id_rol AS creador_rol_id
FROM PROYECTO p
JOIN USUARIO u ON p.id_responsable = u.id_usuario
LEFT JOIN COBERTURA_ART c ON p.id_art = c.id_art
LEFT JOIN CAT_ART ca ON c.id_cat_art = ca.id_cat_art
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
      TO_CHAR(ra.fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'DD-MM-YYYY') AS report_date,
      ra.avance_porcentaje AS report_progress,
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
  let maxProgressFound = 0;

  rows.forEach(row => {
    const rawProgress = parseFloat(row.report_progress || row.stage_progress || 0);
    const currentProgress = Math.round(rawProgress);
    if (currentProgress > maxProgressFound) maxProgressFound = currentProgress;

    if (!reportsMap.has(row.report_id)) {
      reportsMap.set(row.report_id, {
        fecha: formatDate(row.report_date),
        supervisor: row.supervisor_name || "Sin asignar",
        tareas_ejecutadas: new Set(),
        oficios_activos: new Set(),
        porcentaje_avance: currentProgress
      });
    }
    const report = reportsMap.get(row.report_id);
    if (row.task_name) report.tareas_ejecutadas.add(row.task_name);
    if (row.trade_name) report.oficios_activos.add(row.trade_name);
  });

  const registrosAvanceArray = Array.from(reportsMap.values()).map(r => ({
    ...r,
    tareas_ejecutadas: r.tareas_ejecutadas.size > 0 ? Array.from(r.tareas_ejecutadas) : ["Supervisión de obra"],
    oficios_activos: r.oficios_activos.size > 0 ? Array.from(r.oficios_activos) : ["Personal técnico"]
  }));

  const lastRow = rows[rows.length - 1];
  const todasLasMedidas = [...new Set(rows.map(r => r.safety_measure).filter(Boolean))];
  const etapaSegura = lastRow.stage_name || "Etapa General";
  const estadoSeguro = maxProgressFound > 0 ? "EN_CURSO" : (lastRow.validation_status || "PENDIENTE");

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
      avance_estimado: maxProgressFound 
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
    const sql = `
        SELECT 
            p.id_proyecto as id,
            p.codigo as code,
            p.nombre as name,
            p.ubicacion as location,
            p.superficie_m2 as "surfaceM2",
            TO_CHAR(p.fecha_registro AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'DD/MM/YYYY'), 'YYYY-MM-DD') as "registrationDate",
            json_build_object(
                'id', u.id_usuario,
                'name', u.nombre,
                'license', u.matricula
            ) as manager,
            json_build_object(
                'constructionSystemId', p.id_sistema_constructivo,
                'constructionSystemName', sc.nombre,
                'artCoverageId', p.id_art,
                'artName', ca.nombre_entidad_art
            ) as config
        FROM PROYECTO p
        LEFT JOIN USUARIO u ON p.id_responsable = u.id_usuario
        LEFT JOIN SISTEMA_CONSTRUCTIVO sc ON p.id_sistema_constructivo = sc.id_sistema
        LEFT JOIN cobertura_art co ON p.id_art = co.id_art
        LEFT JOIN CAT_ART ca ON co.id_cat_art = ca.id_cat_art
        WHERE p.nombre ILIKE $1
        ORDER BY p.id_proyecto DESC;
    `;

    try {
      const results = await db.any(sql, [`%${name}%`]);
      return results.map(row => new Project(row));
    } catch (error) {
      console.error("error name search:", error.message);
      throw error;
    }
  }

  static async getFullProjectDetail(projectId) {

    const sql = `SELECT 
   p.id_proyecto,
    p.codigo,
    p.nombre,
    p.ubicacion,
    p.superficie_m2,
    TO_CHAR(p.fecha_registro AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'DD/MM/YYYY') as fecha_registro,,
    u.nombre as responsable_nombre,
    u.matricula as responsable_matricula,
    sc.nombre as sistema_constructivo,
    ca.nombre_entidad_art as art_entidad, 
    COALESCE(
      (SELECT json_agg(etapa_data)
      FROM (
        SELECT 
          e.id_etapa,
          te.nombre as etapa_nombre,
          e.progreso,
          e.id_estado,
          es_e.nombre as estado_nombre,
          (
            SELECT json_agg(tarea_data)
            FROM (
              SELECT 
                t.id_tarea,
                tt.nombre as tarea_nombre,
                t.id_estado as tarea_id_estado,
                es_t.nombre as tarea_estado_nombre
              FROM TAREA t
              JOIN TIPO_TAREA tt ON t.id_tipo_tarea = tt.id_tipo_tarea
              JOIN ESTADO es_t ON t.id_estado = es_t.id_estado
              WHERE t.id_etapa = e.id_etapa
            ) tarea_data
          ) as tareas
        FROM ETAPA e
        JOIN TIPO_ETAPA te ON e.id_tipo_etapa = te.id_tipo_etapa
        JOIN ESTADO es_e ON e.id_estado = es_e.id_estado
        WHERE e.id_proyecto = p.id_proyecto
        ORDER BY e.id_etapa ASC
      ) etapa_data), 
      '[]'::json
    ) as etapas,
    
    COALESCE(
      (SELECT json_agg(registro_data)
      FROM (
        SELECT 
          ra.id_registro_avance,
          TO_CHAR(ra.fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires', 'DD/MM/YYYY') as fecha,
          us.nombre as supervisor_nombre,
          COALESCE(vt.estado, 'PENDIENTE') as estado_validacion
        FROM REGISTRO_AVANCE ra
        JOIN USUARIO us ON ra.id_supervisor = us.id_usuario
        LEFT JOIN validacion_tecnica vt ON ra.id_registro_avance = vt.id_registro_avance
        WHERE ra.id_proyecto = p.id_proyecto
        ORDER BY ra.fecha DESC
        LIMIT 5
      ) registro_data), 
      '[]'::json
    ) as historial_reciente
FROM PROYECTO p
JOIN USUARIO u ON p.id_responsable = u.id_usuario
LEFT JOIN SISTEMA_CONSTRUCTIVO sc ON p.id_sistema_constructivo = sc.id_sistema
LEFT JOIN COBERTURA_ART co ON p.id_art = co.id_art
LEFT JOIN CAT_ART ca ON co.id_cat_art = ca.id_cat_art
WHERE p.id_proyecto = $1;`

    const result = await db.oneOrNone(sql, [projectId]);

    if (!result) return null;

    return result;


  }
}
module.exports = Project;