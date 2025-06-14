const Cualificacion = require('../../Models/cualificacion');
const constants = require('../../../constants');

const repo = {
  listar: async () => {
    try {
      const data = await Cualificacion.findAll();
      return { status: constants.SUCCEEDED_MESSAGE, data };
    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || 'Error al listar cualificaciones.'
      };
    }
  },

  insertar: async (datos) => {
    try {
      const nueva = await Cualificacion.create(datos);
      return {
        status: constants.SUCCEEDED_MESSAGE,
        mensaje: 'Cualificación registrada correctamente',
        data: nueva
      };
    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || 'Error al insertar cualificación.'
      };
    }
  },

  actualizar: async (id, datos) => {
    try {
      const item = await Cualificacion.findByPk(id);
      if (!item) {
        return {
          status: constants.FAILED_MESSAGE,
          failure_code: 404,
          failure_message: 'Cualificación no encontrada.'
        };
      }

      await item.update(datos);
      return {
        status: constants.SUCCEEDED_MESSAGE,
        mensaje: 'Cualificación actualizada correctamente'
      };
    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || 'Error al actualizar cualificación.'
      };
    }
  },

  eliminar: async (id) => {
    try {
      const item = await Cualificacion.findByPk(id);
      if (!item) {
        return {
          status: constants.FAILED_MESSAGE,
          failure_code: 404,
          failure_message: 'Cualificación no encontrada.'
        };
      }

      await item.destroy();
      return {
        status: constants.SUCCEEDED_MESSAGE,
        mensaje: 'Cualificación eliminada correctamente'
      };
    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || 'Error al eliminar cualificación.'
      };
    }
  }
};

module.exports = repo;
