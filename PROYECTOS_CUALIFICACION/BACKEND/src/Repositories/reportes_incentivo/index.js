const constants = require('../../../constants');
const ReporteIncentivo = require('../../Models/reporte_incentivo');
const DocenteIncentivo = require('../../Models/docente_incentivo');
const Incentivo = require('../../Models/incentivo');
const Docente = require('../../Models/docente');
const { Op } = require('sequelize');

const repo = {
  subir: async ({ id_docente_incentivo, ruta_archivo }) => {
    try {
      // Verificar que el docente puede subir un reporte en este momento
      const docenteIncentivo = await DocenteIncentivo.findByPk(id_docente_incentivo, {
        include: [{
          model: Incentivo,
          as: 'incentivo'
        }]
      });

      if (!docenteIncentivo) {
        return { 
          status: constants.NOT_FOUND_ERROR_MESSAGE, 
          failure_code: 404, 
          failure_message: 'Asignación de incentivo no encontrada' 
        };
      }

      if (docenteIncentivo.estado !== 'VIGENTE') {
        return { 
          status: constants.INVALID_PARAMETER_SENDED, 
          failure_code: 400, 
          failure_message: 'El incentivo no está vigente' 
        };
      }

      // Verificar que no haya un reporte pendiente muy reciente
      const reporteReciente = await ReporteIncentivo.findOne({
        where: { 
          id_docente_incentivo,
          estado: 'PENDIENTE',
          fecha_envio: {
            [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
          }
        }
      });

      if (reporteReciente) {
        return { 
          status: constants.INVALID_PARAMETER_SENDED, 
          failure_code: 400, 
          failure_message: 'Ya tiene un reporte pendiente reciente. Espere la validación antes de subir otro.' 
        };
      }

      const reporte = await ReporteIncentivo.create({ id_docente_incentivo, ruta_archivo });
      return { status: constants.SUCCEEDED_MESSAGE, reporte };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  listarPendientes: async () => {
    try {
      const reportes = await ReporteIncentivo.findAll({ 
        where: { estado: 'PENDIENTE' }, 
        include: [{ 
          model: DocenteIncentivo, 
          as: 'docente_incentivo',
          include: [
            {
              model: Docente,
              as: 'docente'
            },
            {
              model: Incentivo,
              as: 'incentivo'
            }
          ]
        }],
        order: [['fecha_envio', 'ASC']]
      });
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

      if (reporte.estado !== 'PENDIENTE') {
        return { 
          status: constants.INVALID_PARAMETER_SENDED, 
          failure_code: 400, 
          failure_message: 'El reporte ya ha sido validado previamente' 
        };
      }

      // Si se rechaza, las observaciones son obligatorias
      if (estado === 'RECHAZADO' && (!observaciones || observaciones.trim() === '')) {
        return { 
          status: constants.INVALID_PARAMETER_SENDED, 
          failure_code: 400, 
          failure_message: 'Las observaciones son obligatorias al rechazar un reporte' 
        };
      }

      await reporte.update({ estado, observaciones: observaciones || null });
      return { status: constants.SUCCEEDED_MESSAGE, reporte };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  listarPorDocenteIncentivo: async (id_docente_incentivo) => {
    try {
      const reportes = await ReporteIncentivo.findAll({ 
        where: { id_docente_incentivo },
        order: [['fecha_envio', 'DESC']]
      });
      return { status: constants.SUCCEEDED_MESSAGE, reportes };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  // NUEVAS FUNCIONES AVANZADAS

  listarPorDocente: async (filtros) => {
    try {
      const { id_docente, page, limit } = filtros;
      const offset = (page - 1) * limit;

      const { count, rows } = await ReporteIncentivo.findAndCountAll({
        include: [{
          model: DocenteIncentivo,
          as: 'docente_incentivo',
          where: { id_docente },
          include: [
            {
              model: Docente,
              as: 'docente'
            },
            {
              model: Incentivo,
              as: 'incentivo'
            }
          ]
        }],
        limit,
        offset,
        order: [['fecha_envio', 'DESC']],
        distinct: true
      });

      return {
        status: constants.SUCCEEDED_MESSAGE,
        reportes: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      return { 
        status: constants.INTERNAL_ERROR_MESSAGE, 
        failure_code: error.code || 500, 
        failure_message: error.message 
      };
    }
  },

  obtenerReportesPendientes: async (id_docente) => {
    try {
      // Obtener incentivos vigentes del docente
      const incentivosVigentes = await DocenteIncentivo.findAll({
        where: { id_docente, estado: 'VIGENTE' },
        include: [{
          model: Incentivo,
          as: 'incentivo'
        }]
      });

      const reportesPendientes = await Promise.all(incentivosVigentes.map(async (incentivo) => {
        // Obtener todos los reportes de este incentivo
        const reportesExistentes = await ReporteIncentivo.findAll({
          where: { id_docente_incentivo: incentivo.id_docente_incentivo },
          order: [['fecha_envio', 'ASC']]
        });

        // Calcular fechas de reporte programadas
        const fechasPrograma = repo.generarFechasReporte(
          incentivo.fecha_inicio,
          incentivo.fecha_fin,
          incentivo.frecuencia_informe_dias,
          reportesExistentes
        );

        // Encontrar reportes que faltan o fueron rechazados
        const reportesPendientesEsteIncentivo = fechasPrograma.filter(fecha => {
          if (!fecha.reporte) return true; // No hay reporte para esta fecha
          if (fecha.reporte.estado === 'RECHAZADO') return true; // Reporte rechazado
          return false;
        });

        return {
          incentivo: incentivo.toJSON(),
          reportes_pendientes: reportesPendientesEsteIncentivo,
          puede_subir: repo.puedeSubirReporte(fechasPrograma, reportesExistentes),
          proxima_fecha_limite: repo.obtenerProximaFechaLimite(fechasPrograma, reportesExistentes)
        };
      }));

      return { status: constants.SUCCEEDED_MESSAGE, reportes_pendientes: reportesPendientes };
    } catch (error) {
      return { 
        status: constants.INTERNAL_ERROR_MESSAGE, 
        failure_code: error.code || 500, 
        failure_message: error.message 
      };
    }
  },

  // FUNCIONES AUXILIARES (copiadas del repositorio de incentivos para consistencia)
  
  generarFechasReporte: (fechaInicio, fechaFin, frecuenciaDias, reportesExistentes = []) => {
    const fechas = [];
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    let fechaActual = new Date(inicio);
    fechaActual.setDate(fechaActual.getDate() + frecuenciaDias);

    while (fechaActual <= fin) {
      const reporteExistente = reportesExistentes.find(r => {
        const fechaReporte = new Date(r.fecha_envio);
        const diferenciaDias = Math.abs((fechaReporte - fechaActual) / (1000 * 60 * 60 * 24));
        return diferenciaDias <= 7; // Tolerancia de 7 días
      });

      fechas.push({
        fecha_limite: new Date(fechaActual),
        reporte: reporteExistente || null,
        estado: reporteExistente ? reporteExistente.estado : 'PENDIENTE',
        vencido: !reporteExistente && new Date() > fechaActual
      });

      fechaActual.setDate(fechaActual.getDate() + frecuenciaDias);
    }

    return fechas;
  },

  puedeSubirReporte: (fechasPrograma, reportes) => {
    const hoy = new Date();
    
    // Encuentra la próxima fecha que no tiene reporte o tiene reporte rechazado
    const proximaSlot = fechasPrograma.find(fecha => {
      if (!fecha.reporte) return true;
      if (fecha.reporte.estado === 'RECHAZADO') return true;
      return false;
    });

    if (!proximaSlot) return false;

    // Permite subir hasta 7 días antes de la fecha límite
    const fechaLimite = new Date(proximaSlot.fecha_limite);
    const fechaPermisoSubida = new Date(fechaLimite);
    fechaPermisoSubida.setDate(fechaPermisoSubida.getDate() - 7);

    return hoy >= fechaPermisoSubida && hoy <= fechaLimite;
  },

  obtenerProximaFechaLimite: (fechasPrograma, reportes) => {
    const proximaSlot = fechasPrograma.find(fecha => {
      if (!fecha.reporte) return true;
      if (fecha.reporte.estado === 'RECHAZADO') return true;
      return false;
    });

    return proximaSlot ? proximaSlot.fecha_limite : null;
  }
};

module.exports = repo; 