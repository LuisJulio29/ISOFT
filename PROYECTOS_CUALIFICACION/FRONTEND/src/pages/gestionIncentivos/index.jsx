import { Box, Typography, Alert, CircularProgress, Button, Fab, Tabs, Tab } from '@mui/material';
import { Add as AddIcon, Settings as SettingsIcon, People as PeopleIcon } from '@mui/icons-material';
import { PageBreadcrumb } from 'components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Hooks
import { useIncentivosDashboard } from './hooks/useIncentivosDashboard';

// Componentes
import EstadisticasPanel from './components/EstadisticasPanel';
import DocentesTable from './components/DocentesTable';
import AsignarIncentivoModal from './components/AsignarIncentivoModal';
import EditarIncentivoModal from './components/EditarIncentivoModal';
import GestionIncentivosTipos from './components/GestionIncentivosTipos';

const GestionIncentivos = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    estadisticas,
    docentesAsignados,
    reportesPendientes,
    filtros,
    totalDocentes,
    totalPages,
    asignarIncentivo,
    actualizarAsignacion,
    eliminarAsignacion,
    actualizarFiltros,
    cambiarPagina,
    setError
  } = useIncentivosDashboard();

  // Estados para pestañas y modales
  const [tabActiva, setTabActiva] = useState(0);
  const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [docenteIncentivoSeleccionado, setDocenteIncentivoSeleccionado] = useState(null);

  // Manejar ver proceso de reportes - navegar a vista completa
  const handleVerProceso = (docenteIncentivo) => {
    navigate(`/proceso-reportes/${docenteIncentivo.id_docente_incentivo}`);
  };

  // Manejar editar incentivo
  const handleEditarIncentivo = (docenteIncentivo) => {
    setDocenteIncentivoSeleccionado(docenteIncentivo);
    setModalEditarAbierto(true);
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

  // Actualizar asignación de incentivo
  const handleActualizarAsignacion = async (id_docente_incentivo, formData) => {
    return await actualizarAsignacion(id_docente_incentivo, formData);
  };

  // Eliminar asignación de incentivo
  const handleEliminarAsignacion = async (id_docente_incentivo, formData) => {
    return await eliminarAsignacion(id_docente_incentivo, formData);
  };

  // Cerrar modal de edición
  const handleCerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setDocenteIncentivoSeleccionado(null);
  };

  // Cambiar pestaña
  const handleCambiarTab = (event, newValue) => {
    setTabActiva(newValue);
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
      
      {loading && !estadisticas && tabActiva === 0 ? (
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
          {/* Navegación por pestañas */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabActiva} onChange={handleCambiarTab} aria-label="gestión incentivos tabs">
              <Tab 
                icon={<PeopleIcon />} 
                label="Incentivos Asignados" 
                iconPosition="start"
              />
              <Tab 
                icon={<SettingsIcon />} 
                label="Gestión de Tipos" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Contenido de la pestaña activa */}
          {tabActiva === 0 ? (
            <>
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
            </>
          ) : (
            /* Gestión de tipos de incentivos */
            <GestionIncentivosTipos />
          )}

          {/* Modal de asignación de incentivos */}
          <AsignarIncentivoModal
            open={modalAsignarAbierto}
            onClose={handleCerrarModalAsignar}
            onAsignar={handleAsignarIncentivo}
          />

          {/* Modal de edición de incentivos asignados */}
          <EditarIncentivoModal
            open={modalEditarAbierto}
            onClose={handleCerrarModalEditar}
            docenteIncentivo={docenteIncentivoSeleccionado}
            onActualizar={handleActualizarAsignacion}
            onEliminar={handleEliminarAsignacion}
          />
        </Box>
      )}

      {/* Botón flotante para asignar incentivo (solo en la primera pestaña) */}
      {tabActiva === 0 && (
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
      )}
    </Box>
  );
};

export default GestionIncentivos; 