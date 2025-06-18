const constants = require('../../../constants');
const Incentivo = require('../../Models/incentivo');
const DocenteIncentivo = require('../../Models/docente_incentivo');

const repo = {
  insertar: async (data) => {
    try {
      const incentivo = await Incentivo.create({
        nombre: data.nombre,
        frecuencia_informe_dias: data.frecuencia_informe_dias,
        tiempo_minimo_meses: data.tiempo_minimo_meses,
        tiempo_maximo_meses: data.tiempo_maximo_meses,
        descripcion: data.descripcion,
      });
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
      const incentivos = await Incentivo.findAll({ where: { estado: 'ACTIVO' } });
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
      await incentivo.update({ estado: 'INACTIVO' });
      return { status: constants.SUCCEEDED_MESSAGE };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  asignar: async ({ id_docente, id_incentivo, fecha_inicio, fecha_fin }) => {
    try {
      const incentivo = await Incentivo.findByPk(id_incentivo);
      if (!incentivo) {
        return { status: constants.NOT_FOUND_ERROR_MESSAGE, failure_code: 404, failure_message: 'Incentivo no encontrado' };
      }

      const fechaInicio = fecha_inicio ? new Date(fecha_inicio) : new Date();
      let fechaFin = fecha_fin ? new Date(fecha_fin) : null;

      const MIN = incentivo.tiempo_minimo_meses;
      const MAX = incentivo.tiempo_maximo_meses;

      // Calcula fecha_fin si longitud fija
      if (MIN === MAX) {
        fechaFin = new Date(fechaInicio);
        fechaFin.setMonth(fechaFin.getMonth() + MIN);
      } else {
        if (!fechaFin) {
          return { status: constants.INVALID_PARAMETER_SENDED, failure_message: 'Debe enviar fecha_fin' };
        }
        const diffMonths = (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 + (fechaFin.getMonth() - fechaInicio.getMonth());
        if (diffMonths < MIN || diffMonths > MAX) {
          return { status: constants.INVALID_PARAMETER_SENDED, failure_message: `La duración debe estar entre ${MIN} y ${MAX} meses` };
        }
      }

      const frecuencia = incentivo.frecuencia_informe_dias;

      const asignacion = await DocenteIncentivo.create({
        id_docente,
        id_incentivo,
        fecha_asignacion: new Date(),
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        frecuencia_informe_dias: frecuencia,
      });

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