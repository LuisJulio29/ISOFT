const constants = require('../../../constants');
const objModel = require('../../Models/formacion');

const repo = {

  insertar: async (formacion) => {
    try {
      if (formacion.id_formacion) {
        const existente = await objModel.findOne({ where: { id_formacion: formacion.id_formacion } });
        if (existente) {
          return {
            status: constants.SUCCEEDED_MESSAGE,
            mensaje: "La formación ya existe.",
            failure_code: 409,
            failure_message: "La formación ya existe."
          };
        }
      }


      const nuevaFormacion = await objModel.create({
        id_formacion: formacion.id_formacion,
        nombre_formacion: formacion.nombre_formacion,
        periodo: formacion.periodo,
        linea_cualificacion: formacion.linea_cualificacion,
        numero_horas: formacion.numero_horas,
        fecha_inicio: formacion.fecha_inicio,
        fecha_terminacion: formacion.fecha_terminacion,
        observaciones: formacion.observaciones
      });

      return {
        status: constants.SUCCEEDED_MESSAGE,
        formacion: nuevaFormacion,
        failure_code: null,
        failure_message: null
      };

    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        mensaje: "Error al crear la formación.",
        failure_code: error.code || 500,
        failure_message: error.message || "Error interno del servidor."
      };
    }
  },

  listar: async () => {
    try {
      const formaciones = await objModel.findAll();
      return {
        status: constants.SUCCEEDED_MESSAGE,
        formaciones
      };
    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || "Error al listar formaciones."
      };
    }
  },

  actualizar: async (id_formacion, datos) => {
    try {
      const formacion = await objModel.findByPk(id_formacion);
      if (!formacion) {
        return {
          status: 'error',
          mensaje: 'Formación no encontrada.',
          failure_code: 404
        };
      }

      await formacion.update(datos);

      return {
        status: constants.SUCCEEDED_MESSAGE,
        formacion
      };

    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || "Error al actualizar la formación."
      };
    }
  },

  eliminar: async (id_formacion) => {
    try {
      const formacion = await objModel.findByPk(id_formacion);
      if (!formacion) {
        return {
          status: 'error',
          mensaje: 'Formación no encontrada.',
          failure_code: 404
        };
      }

      await formacion.destroy();

      return {
        status: constants.SUCCEEDED_MESSAGE,
        mensaje: 'Formación eliminada exitosamente.'
      };

    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || "Error al eliminar la formación."
      };
    }
  },

    cargarMasivamente: async (formaciones) => {
    try {
      const resultado = await objModel.bulkCreate(formaciones, { validate: true });
      return {
        status: constants.SUCCEEDED_MESSAGE,
        data: resultado
      };
    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || "Error al cargar formaciones masivamente."
      };
    }
  },

};

module.exports = repo;
