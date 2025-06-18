const constants = require('../../../constants');
const ReporteIncentivo = require('../../Models/reporte_incentivo');
const DocenteIncentivo = require('../../Models/docente_incentivo');

const repo = {
  subir: async ({ id_docente_incentivo, ruta_archivo }) => {
    try {
      const reporte = await ReporteIncentivo.create({ id_docente_incentivo, ruta_archivo });
      return { status: constants.SUCCEEDED_MESSAGE, reporte };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  listarPendientes: async () => {
    try {
      const reportes = await ReporteIncentivo.findAll({ where: { estado: 'PENDIENTE' }, include: [{ model: DocenteIncentivo, as: 'docente_incentivo' }] });
      return { status: constants.SUCCEEDED_MESSAGE, reportes };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  validar: async (id_reporte_incentivo, { estado, observaciones }) => {
    try {
      const reporte = await ReporteIncentivo.findByPk(id_reporte_incentivo);
      if (!reporte) {
        return { status: constants.NOT_FOUND_ERROR_MESSAGE, failure_code: 404, failure_message: 'Reporte no encontrado' };
      }
      await reporte.update({ estado, observaciones });
      return { status: constants.SUCCEEDED_MESSAGE, reporte };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  listarPorDocenteIncentivo: async (id_docente_incentivo) => {
    try {
      const reportes = await ReporteIncentivo.findAll({ where: { id_docente_incentivo } });
      return { status: constants.SUCCEEDED_MESSAGE, reportes };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  }
};

module.exports = repo; 