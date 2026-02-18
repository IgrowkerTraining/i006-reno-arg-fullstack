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
    return {
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

  static async create(data) {
    const {
      constructionSystemId,
      artCoverageId = null,
    } = data.config || {};

    const sql = `
      INSERT INTO PROYECTO (
        codigo, nombre, ubicacion, superficie_m2, 
        id_responsable, id_sistema_constructivo, id_art, matricula_responsable
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const params = [
      data.code,
      data.name,
      data.location,
      data.surfaceM2,
      data.managerId,
      constructionSystemId,
      artCoverageId,
      data.managerLicense
    ];

    const result = await db.one(sql, params);
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
}

module.exports = Project;