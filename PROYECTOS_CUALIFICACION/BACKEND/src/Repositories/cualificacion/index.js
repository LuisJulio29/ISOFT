const Cualificacion = require('../../Models/cualificacion');
const Formacion = require('../../Models/formacion');
const Docente = require('../../Models/docente');
const constants = require('../../../constants');
const Usuarios_Docentes = require('../../Models/usuario_docente');

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
  },
  
  obtenerCualificacionesPorUsuarioId: async (idUsuario) => {
  try {
    const relacion = await Usuarios_Docentes.findOne({
      where: { id_usuario: idUsuario }
    });

    if (!relacion) {
      return { error: 'No se encontró un docente asociado a este usuario.' };
    }

    const idDocente = relacion.id_docente;

    const cualificaciones = await Cualificacion.findAll({
      where: { id_docente: idDocente },
      include: [
        {
          model: Formacion,
          as: 'formacion'
        }
      ],
      order: [['año_cursado', 'DESC']]
    });

    const resultado = cualificaciones.map((cual) => {
      const f = cual.formacion;

      return {
        id: cual.id_cualificacion,
        titulo: f?.nombre_formacion || 'Sin título',
        periodo: f?.periodo || 'N/A',
        linea: f?.linea_cualificacion || 'N/A',
        horas: f?.numero_horas || 0,
        inicio: f?.fecha_inicio || null,
        fin: f?.fecha_terminacion || null,
        observaciones: f?.observaciones || '',
      };
    });

    return resultado;
  } catch (error) {
    console.error('Error al obtener cualificaciones por usuario:', error);
    throw error;
  }
}

};



module.exports = repo;
