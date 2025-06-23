import { useEffect, useState } from 'react';
import { gsUrlApi } from '@src/config/ConfigServer';

export const useIncentivosDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados principales
  const [estadisticas, setEstadisticas] = useState(null);
  const [docentesAsignados, setDocentesAsignados] = useState([]);
  const [reportesPendientes, setReportesPendientes] = useState([]);
  
  // Estados de paginación y filtros
  const [filtros, setFiltros] = useState({
    estado: 'VIGENTE',
    tipo_incentivo: '',
    busqueda: '',
    page: 1,
    limit: 10
  });
  const [totalDocentes, setTotalDocentes] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const token = localStorage.getItem('token');

  // Cargar estadísticas generales
  const cargarEstadisticas = async () => {
    try {
      const resp = await fetch(`${gsUrlApi}/incentivos/estadisticas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      if (resp.ok) {
        setEstadisticas(data.estadisticas);
      } else {
        setError(data.message || 'Error al cargar estadísticas');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Cargar docentes con incentivos asignados
  const cargarDocentesAsignados = async (filtrosActuales = filtros) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filtrosActuales);
      const resp = await fetch(`${gsUrlApi}/incentivos/docentes-asignados?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      if (resp.ok) {
        setDocentesAsignados(data.docentes || []);
        setTotalDocentes(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        setError(data.message || 'Error al cargar docentes');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar reportes pendientes
  const cargarReportesPendientes = async () => {
    try {
      const resp = await fetch(`${gsUrlApi}/incentivos/reportes/pendientes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      if (resp.ok) {
        setReportesPendientes(data.reportes || []);
      } else {
        setError(data.message || 'Error al cargar reportes pendientes');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Validar reporte
  const validarReporte = async (idReporte, estado, observaciones = '') => {
    try {
      const resp = await fetch(`${gsUrlApi}/incentivos/reportes/${idReporte}/validar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado, observaciones })
      });
      const data = await resp.json();
      if (resp.ok) {
        // Recargar reportes pendientes
        await cargarReportesPendientes();
        await cargarEstadisticas();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Asignar incentivo mejorado
  const asignarIncentivo = async (datosAsignacion) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      // Si es FormData, no incluir Content-Type (se establece automáticamente)
      if (!(datosAsignacion instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const resp = await fetch(`${gsUrlApi}/incentivos/asignar`, {
        method: 'POST',
        headers,
        body: datosAsignacion instanceof FormData ? datosAsignacion : JSON.stringify(datosAsignacion)
      });
      const data = await resp.json();
      if (resp.ok) {
        // Recargar datos
        await cargarDocentesAsignados();
        await cargarEstadisticas();
        return { success: true, asignacion: data.asignacion };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Obtener reportes de un docente específico
  const obtenerReportesDocente = async (idDocente) => {
    try {
      const resp = await fetch(`${gsUrlApi}/incentivos/reportes/docente/${idDocente}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      if (resp.ok) {
        return { success: true, reportes: data.reportes };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Manejar cambios de filtros
  const actualizarFiltros = (nuevosFiltros) => {
    const filtrosActualizados = { ...filtros, ...nuevosFiltros, page: 1 };
    setFiltros(filtrosActualizados);
    cargarDocentesAsignados(filtrosActualizados);
  };

  // Cambiar página
  const cambiarPagina = (nuevaPagina) => {
    const filtrosActualizados = { ...filtros, page: nuevaPagina };
    setFiltros(filtrosActualizados);
    cargarDocentesAsignados(filtrosActualizados);
  };

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoading(true);
      await Promise.all([
        cargarEstadisticas(),
        cargarDocentesAsignados(),
        cargarReportesPendientes()
      ]);
      setLoading(false);
    };
    
    cargarDatosIniciales();
    // eslint-disable-next-line
  }, []);

  return {
    // Estados
    loading,
    error,
    estadisticas,
    docentesAsignados,
    reportesPendientes,
    filtros,
    totalDocentes,
    totalPages,
    
    // Funciones
    cargarEstadisticas,
    cargarDocentesAsignados,
    cargarReportesPendientes,
    validarReporte,
    asignarIncentivo,
    obtenerReportesDocente,
    actualizarFiltros,
    cambiarPagina,
    
    // Utilidades
    setError
  };
}; 