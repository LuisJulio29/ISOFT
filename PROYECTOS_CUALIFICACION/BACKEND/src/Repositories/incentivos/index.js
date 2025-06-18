const constants = require('../../../constants');
const Incentivo = require('../../Models/incentivo');
const DocenteIncentivo = require('../../Models/docente_incentivo');

const repo = {
  insertar: async (data) => {
    try {
      const incentivo = await Incentivo.create(data);
      return { status: constants.SUCCEEDED_MESSAGE, incentivo };
    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || 'Error al crear incentivo.'
      };
    }
  },

  listar: async () => {
    try {
      const incentivos = await Incentivo.findAll();
      return { status: constants.SUCCEEDED_MESSAGE, incentivos };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  actualizar: async (id_incentivo, data) => {
    try {
      const incentivo = await Incentivo.findByPk(id_incentivo);
      if (!incentivo) {
        return { status: constants.NOT_FOUND_ERROR_MESSAGE, failure_code: 404, failure_message: 'Incentivo no encontrado' };
      }
      await incentivo.update(data);
      return { status: constants.SUCCEEDED_MESSAGE, incentivo };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  eliminar: async (id_incentivo) => {
    try {
      const incentivo = await Incentivo.findByPk(id_incentivo);
      if (!incentivo) {
        return { status: constants.NOT_FOUND_ERROR_MESSAGE, failure_code: 404, failure_message: 'Incentivo no encontrado' };
      }
      await incentivo.destroy();
      return { status: constants.SUCCEEDED_MESSAGE };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  asignar: async ({ id_docente, id_incentivo, fecha_asignacion }) => {
    try {
      const asignacion = await DocenteIncentivo.create({ id_docente, id_incentivo, fecha_asignacion });
      return { status: constants.SUCCEEDED_MESSAGE, asignacion };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  listarPorDocente: async (id_docente) => {
    try {
      const incentivos = await DocenteIncentivo.findAll({ where: { id_docente }, include: ['incentivo'] });
      return { status: constants.SUCCEEDED_MESSAGE, incentivos };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  }
};

module.exports = repo; 