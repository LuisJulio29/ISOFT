import { Box, Typography, Alert, CircularProgress, Button, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageBreadcrumb } from 'components';
import { useState } from 'react';
import Swal from 'sweetalert2';

// Hooks
import { useIncentivosDashboard } from './hooks/useIncentivosDashboard';

// Componentes
import EstadisticasPanel from './components/EstadisticasPanel';
import DocentesTable from './components/DocentesTable';
import ReportesModal from './components/ReportesModal';
import AsignarIncentivoModal from './components/AsignarIncentivoModal';

const GestionIncentivos = () => {
  const {
    loading,
    error,
    estadisticas,
    docentesAsignados,
    reportesPendientes,
    filtros,
    totalDocentes,
    totalPages,
    validarReporte,
    asignarIncentivo,
    actualizarFiltros,
    cambiarPagina,
    setError
  } = useIncentivosDashboard();

  // Estados para modales
  const [modalReportesAbierto, setModalReportesAbierto] = useState(false);
  const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);

  // Manejar ver proceso de reportes
  const handleVerProceso = (docenteIncentivo) => {
    setDocenteSeleccionado(docenteIncentivo);
    setModalReportesAbierto(true);
  };

  // Manejar editar incentivo (placeholder para futura implementación)
  const handleEditarIncentivo = (docenteIncentivo) => {
    Swal.fire({
      title: 'Editar Incentivo',
      text: `Funcionalidad para editar el incentivo de ${docenteIncentivo.docente?.nombre || 'docente'}`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  };

  // Manejar asignación de incentivo
  const handleAsignarIncentivo = async (datosAsignacion) => {
    const resultado = await asignarIncentivo(datosAsignacion);
    return resultado;
  };

  // Abrir modal de asignación
  const handleAbrirModalAsignar = () => {
    setModalAsignarAbierto(true);
  };

  // Cerrar modal de asignación
  const handleCerrarModalAsignar = () => {
    setModalAsignarAbierto(false);
  };

  // Cerrar modal de reportes
  const handleCerrarModalReportes = () => {
    setModalReportesAbierto(false);
    setDocenteSeleccionado(null);
  };

  if (error) {
    return (
      <Box component="main" sx={{ flexGrow: 1 }}>
        <PageBreadcrumb title="Gestión de Incentivos" subName="Administración" />
        <Alert severity="error" sx={{ mt: 2 }}>
          Error al cargar los datos: {error}
          <br />
          <button onClick={() => setError(null)} style={{ marginTop: '8px' }}>
            Reintentar
          </button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <PageBreadcrumb title="Gestión de Incentivos" subName="Administración" />
      
      {loading && !estadisticas ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando dashboard...
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          {/* Panel de estadísticas */}
          <EstadisticasPanel 
            estadisticas={estadisticas} 
            loading={loading && !estadisticas} 
          />

          {/* Alertas de reportes pendientes */}
          {reportesPendientes && reportesPendientes.length > 0 && (
            <Alert 
              severity="warning" 
              sx={{ mb: 3 }}
              action={
                <Typography variant="body2" fontWeight="bold">
                  {reportesPendientes.length} reportes pendientes
                </Typography>
              }
            >
              <Typography variant="body2">
                Hay {reportesPendientes.length} reportes esperando validación. 
                Revisa la tabla de docentes para procesarlos.
              </Typography>
            </Alert>
          )}

          {/* Tabla de docentes */}
          <DocentesTable
            docentes={docentesAsignados}
            loading={loading}
            filtros={filtros}
            onFiltroChange={actualizarFiltros}
            onVerProceso={handleVerProceso}
            onEditarIncentivo={handleEditarIncentivo}
            totalDocentes={totalDocentes}
            totalPages={totalPages}
            onPaginaChange={cambiarPagina}
          />

          {/* Modal de reportes */}
          <ReportesModal
            open={modalReportesAbierto}
            onClose={handleCerrarModalReportes}
            docenteIncentivo={docenteSeleccionado}
            onValidarReporte={validarReporte}
          />

          {/* Modal de asignación de incentivos */}
          <AsignarIncentivoModal
            open={modalAsignarAbierto}
            onClose={handleCerrarModalAsignar}
            onAsignar={handleAsignarIncentivo}
          />
        </Box>
      )}

      {/* Botón flotante para asignar incentivo */}
      <Fab
        color="primary"
        aria-label="asignar incentivo"
        onClick={handleAbrirModalAsignar}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default GestionIncentivos; 