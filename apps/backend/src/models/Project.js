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
            c.nombre_entidad_art AS nombre_art, 
            u.nombre AS creador_nombre,
            r.nombre AS creador_rol_nombre,
            u.id_rol AS creador_rol_id
        FROM PROYECTO p
        JOIN USUARIO u ON p.id_responsable = u.id_usuario
        LEFT JOIN COBERTURA_ART c ON p.id_art = c.id_art
        LEFT JOIN ROL r ON u.id_rol = r.id_rol
        WHERE p.id_proyecto = $1
    `, [projectId]);
  }

}

module.exports = Project;