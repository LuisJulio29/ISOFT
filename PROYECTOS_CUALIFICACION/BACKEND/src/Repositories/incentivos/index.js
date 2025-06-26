const constants = require('../../../constants');
const Incentivo = require('../../Models/incentivo');
const DocenteIncentivo = require('../../Models/docente_incentivo');
const ReporteIncentivo = require('../../Models/reporte_incentivo');
const Docente = require('../../Models/docente');
const { Op } = require('sequelize');

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

  asignar: async ({ id_docente, id_incentivo, fecha_inicio, fecha_fin, observaciones, resolucion }) => {
    try {
      // Verificar si el docente ya tiene un incentivo vigente
      const incentivoVigente = await DocenteIncentivo.findOne({
        where: { 
          id_docente, 
          estado: 'VIGENTE' 
        }
      });

      if (incentivoVigente) {
        return { 
          status: constants.INVALID_PARAMETER_SENDED, 
          failure_code: 400,
          failure_message: 'El docente ya tiene un incentivo vigente' 
        };
      }

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

      // Usar la frecuencia definida en el incentivo
      const frecuencia = incentivo.frecuencia_informe_dias;

      const asignacion = await DocenteIncentivo.create({
        id_docente,
        id_incentivo,
        fecha_asignacion: new Date(),
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        frecuencia_informe_dias: frecuencia,
        resolucion: resolucion || null,
        observaciones: observaciones || null
      });

      return { status: constants.SUCCEEDED_MESSAGE, asignacion };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  listarPorDocente: async (id_docente) => {
    try {
      const incentivos = await DocenteIncentivo.findAll({ 
        where: { id_docente }, 
        include: [{
          model: Incentivo,
          as: 'incentivo'
        }]
      });
      return { status: constants.SUCCEEDED_MESSAGE, incentivos };
    } catch (error) {
      return { status: constants.INTERNAL_ERROR_MESSAGE, failure_code: error.code || 500, failure_message: error.message };
    }
  },

  // NUEVAS FUNCIONES AVANZADAS

  listarDocentesAsignados: async (filtros) => {
    try {
      const { estado, tipo_incentivo, busqueda, page, limit } = filtros;
      const offset = (page - 1) * limit;

      let whereClause = {};
      let includeClause = [
        {
          model: Docente,
          as: 'docente',
          required: true,
          where: busqueda ? {
            [Op.or]: [
              { nombre: { [Op.iLike]: `%${busqueda}%` } },
              { apellidos: { [Op.iLike]: `%${busqueda}%` } },
              { numero_identificacion: { [Op.iLike]: `%${busqueda}%` } }
            ]
          } : {}
        },
        {
          model: Incentivo,
          as: 'incentivo',
          where: tipo_incentivo ? { nombre: { [Op.iLike]: `%${tipo_incentivo}%` } } : {}
        }
      ];

      if (estado) {
        whereClause.estado = estado;
      }

      const { count, rows } = await DocenteIncentivo.findAndCountAll({
        where: whereClause,
        include: includeClause,
        limit,
        offset,
        order: [['fecha_asignacion', 'DESC']],
        distinct: true
      });

      // Calcular próximas fechas de reporte para cada docente
      const docentesConProgreso = await Promise.all(rows.map(async (docenteIncentivo) => {
        const reportes = await ReporteIncentivo.findAll({
          where: { id_docente_incentivo: docenteIncentivo.id_docente_incentivo },
          order: [['fecha_envio', 'DESC']]
        });

        const proximaFecha = repo.calcularProximaFechaReporte(
          docenteIncentivo.fecha_inicio,
          docenteIncentivo.frecuencia_informe_dias,
          reportes
        );

        const reportesPendientes = reportes.filter(r => r.estado === 'PENDIENTE').length;

        return {
          ...docenteIncentivo.toJSON(),
          proxima_fecha_reporte: proximaFecha,
          reportes_pendientes: reportesPendientes,
          total_reportes: reportes.length
        };
      }));

      return {
        status: constants.SUCCEEDED_MESSAGE,
        docentes: docentesConProgreso,
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

  obtenerEstadisticas: async () => {
    try {
      const totalIncentivos = await Incentivo.count({ where: { estado: 'ACTIVO' } });
      const incentivoVigentes = await DocenteIncentivo.count({ where: { estado: 'VIGENTE' } });
      const incentivoFinalizados = await DocenteIncentivo.count({ where: { estado: 'FINALIZADO' } });
      
      const reportesPendientes = await ReporteIncentivo.count({ where: { estado: 'PENDIENTE' } });
      const reportesValidados = await ReporteIncentivo.count({ where: { estado: 'VALIDADO' } });
      const reportesRechazados = await ReporteIncentivo.count({ where: { estado: 'RECHAZADO' } });

      // Estadísticas por tipo de incentivo
      const incentivosPorTipo = await DocenteIncentivo.findAll({
        attributes: [
          [Incentivo.sequelize.col('incentivo.nombre'), 'tipo_incentivo'],
          [Incentivo.sequelize.fn('COUNT', Incentivo.sequelize.col('DocenteIncentivo.id_docente_incentivo')), 'cantidad']
        ],
        include: [{
          model: Incentivo,
          as: 'incentivo',
          attributes: []
        }],
        where: { estado: 'VIGENTE' },
        group: ['incentivo.nombre'],
        raw: true
      });

      const estadisticas = {
        totales: {
          incentivos_activos: totalIncentivos,
          incentivos_vigentes: incentivoVigentes,
          incentivos_finalizados: incentivoFinalizados
        },
        reportes: {
          pendientes: reportesPendientes,
          validados: reportesValidados,
          rechazados: reportesRechazados
        },
        por_tipo: incentivosPorTipo
      };

      return { status: constants.SUCCEEDED_MESSAGE, estadisticas };
    } catch (error) {
      return { 
        status: constants.INTERNAL_ERROR_MESSAGE, 
        failure_code: error.code || 500, 
        failure_message: error.message 
      };
    }
  },

  calcularFechasReporte: async (id_docente_incentivo) => {
    try {
      const docenteIncentivo = await DocenteIncentivo.findByPk(id_docente_incentivo);
      if (!docenteIncentivo) {
        return { 
          status: constants.NOT_FOUND_ERROR_MESSAGE, 
          failure_code: 404, 
          failure_message: 'Asignación de incentivo no encontrada' 
        };
      }

      const reportes = await ReporteIncentivo.findAll({
        where: { id_docente_incentivo },
        order: [['fecha_envio', 'ASC']]
      });

      const fechas = repo.generarFechasReporte(
        docenteIncentivo.fecha_inicio,
        docenteIncentivo.fecha_fin,
        docenteIncentivo.frecuencia_informe_dias,
        reportes
      );

      return { status: constants.SUCCEEDED_MESSAGE, fechas };
    } catch (error) {
      return { 
        status: constants.INTERNAL_ERROR_MESSAGE, 
        failure_code: error.code || 500, 
        failure_message: error.message 
      };
    }
  },

  obtenerProgreso: async (id_docente) => {
    try {
      const incentivos = await DocenteIncentivo.findAll({
        where: { id_docente, estado: 'VIGENTE' },
        include: [{
          model: Incentivo,
          as: 'incentivo'
        }]
      });

      const progresoCompleto = await Promise.all(incentivos.map(async (incentivo) => {
        const reportes = await ReporteIncentivo.findAll({
          where: { id_docente_incentivo: incentivo.id_docente_incentivo },
          order: [['fecha_envio', 'ASC']]
        });

        const fechasPrograma = repo.generarFechasReporte(
          incentivo.fecha_inicio,
          incentivo.fecha_fin,
          incentivo.frecuencia_informe_dias,
          reportes
        );

        const reportesValidados = reportes.filter(r => r.estado === 'VALIDADO').length;
        const reportesPendientes = reportes.filter(r => r.estado === 'PENDIENTE').length;
        const reportesRechazados = reportes.filter(r => r.estado === 'RECHAZADO').length;

        const progreso = {
          porcentaje: Math.round((reportesValidados / fechasPrograma.length) * 100),
          reportes_completados: reportesValidados,
          reportes_pendientes: reportesPendientes,
          reportes_rechazados: reportesRechazados,
          total_reportes_requeridos: fechasPrograma.length
        };

        return {
          ...incentivo.toJSON(),
          reportes,
          fechas_programa: fechasPrograma,
          progreso,
          puede_subir_reporte: repo.puedeSubirReporte(fechasPrograma, reportes),
          proxima_fecha_limite: repo.obtenerProximaFechaLimite(fechasPrograma, reportes)
        };
      }));

      return { status: constants.SUCCEEDED_MESSAGE, progreso: progresoCompleto };
    } catch (error) {
      return { 
        status: constants.INTERNAL_ERROR_MESSAGE, 
        failure_code: error.code || 500, 
        failure_message: error.message 
      };
    }
  },

  // FUNCIONES AUXILIARES

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

  calcularProximaFechaReporte: (fechaInicio, frecuenciaDias, reportes) => {
    const inicio = new Date(fechaInicio);
    let proximaFecha = new Date(inicio);
    proximaFecha.setDate(proximaFecha.getDate() + frecuenciaDias);

    let reportesContados = 0;
    while (reportesContados < reportes.length) {
      proximaFecha.setDate(proximaFecha.getDate() + frecuenciaDias);
      reportesContados++;
    }

    return proximaFecha;
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