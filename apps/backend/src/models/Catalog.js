const db = require('../config/db');

class Catalog {
  static async getPlanningStructure() {
    const sql = `
      SELECT 
        te.id_tipo_etapa, 
        te.nombre AS etapa_nombre, 
        tt.id_tipo_tarea, 
        tt.nombre AS tarea_nombre
      FROM TIPO_ETAPA te
      LEFT JOIN TIPO_TAREA tt ON te.id_tipo_etapa = tt.id_tipo_etapa
      ORDER BY te.id_tipo_etapa, tt.id_tipo_tarea;
    `;
    const rows = await db.any(sql);
    return this._formatPlanning(rows);
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
