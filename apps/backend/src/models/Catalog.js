const db = require('../config/db');

class Catalog {

  static async getSystems() {
    const sql = `
      SELECT id_sistema AS id_system, nombre AS name
      FROM SISTEMA_CONSTRUCTIVO 
      ORDER BY id_sistema ASC;
    `;
    return await db.any(sql);
  }

  static async getPlanningStructure() {
    const sql = `
      SELECT 
        te.id_tipo_etapa as id_stage, 
        te.nombre AS stage_name, 
        tt.id_tipo_tarea as id_task, 
        tt.nombre AS task_name
      FROM TIPO_ETAPA te
      LEFT JOIN TIPO_TAREA tt ON te.id_tipo_etapa = tt.id_tipo_etapa
      ORDER BY te.id_tipo_etapa, tt.id_tipo_tarea;
    `;
    const rows = await db.any(sql);
    return this._formatPlanning(rows);
  }
  static async getTrades() {
  const sql = `
    SELECT 
      id_oficio as id_trade, 
      nombre as name
    FROM OFICIO;
  `;
  return await db.any(sql);
}
static async getSafetyMeasures() {
  const sql = `
    SELECT 
      id_medidas_seg AS id_safety_measure, 
      descripcion AS name
    FROM MEDIDAS_SEGURIDAD;
  `;
  return await db.any(sql);
}

static async getArts(){
  const sql = ` Select id_cat_art as id_art, nombre_entidad_art as name from CAT_ART;`;
  return await db.any(sql);
}


  static _formatPlanning(rows) {
    return rows.reduce((acc, row) => {
      let stage = acc.find(s => s.id === row.id_tipo_etapa);
      if (!stage) {
        stage = { id: row.id_tipo_etapa, name: row.etapa_nombre, tasks: [] };
        acc.push(stage);
      }
      if (row.id_tipo_tarea) {
        stage.tasks.push({ id: row.id_tipo_tarea, name: row.tarea_nombre });
      }
      return acc;
    }, []);
  }
}

module.exports = Catalog;
