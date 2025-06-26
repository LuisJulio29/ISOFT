import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useIncentivos } from '../useIncentivos';

const FormIncentivoModal = ({ open, onClose, incentivo, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: incentivo?.nombre || '',
    descripcion: incentivo?.descripcion || '',
    frecuencia_informe_dias: incentivo?.frecuencia_informe_dias || 30,
    tiempo_minimo_meses: incentivo?.tiempo_minimo_meses || 12,
    tiempo_maximo_meses: incentivo?.tiempo_maximo_meses || 12
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (incentivo) {
      setFormData({
        nombre: incentivo.nombre || '',
        descripcion: incentivo.descripcion || '',
        frecuencia_informe_dias: incentivo.frecuencia_informe_dias || 30,
        tiempo_minimo_meses: incentivo.tiempo_minimo_meses || 12,
        tiempo_maximo_meses: incentivo.tiempo_maximo_meses || 12
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        frecuencia_informe_dias: 30,
        tiempo_minimo_meses: 12,
        tiempo_maximo_meses: 12
      });
    }
  }, [incentivo, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      Swal.fire('Error', 'El nombre del incentivo es obligatorio', 'warning');
      return;
    }

    if (formData.tiempo_minimo_meses > formData.tiempo_maximo_meses) {
      Swal.fire('Error', 'El tiempo mínimo no puede ser mayor al tiempo máximo', 'warning');
      return;
    }

    setLoading(true);
    try {
      const resultado = await onGuardar(formData);
      if (resultado.success) {
        Swal.fire('Éxito', 
          incentivo ? 'Incentivo actualizado correctamente' : 'Incentivo creado correctamente', 
          'success'
        );
        onClose();
      } else {
        Swal.fire('Error', resultado.message || 'No se pudo guardar el incentivo', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <SettingsIcon color="primary" />
          <Typography variant="h6">
            {incentivo ? 'Editar Incentivo' : 'Crear Nuevo Incentivo'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Incentivo"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Ej: Año Sabático, Comisión de Estudios..."
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Frecuencia de Informe (días)"
                type="number"
                value={formData.frecuencia_informe_dias}
                onChange={(e) => handleChange('frecuencia_informe_dias', parseInt(e.target.value) || 30)}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tiempo Mínimo (meses)"
                type="number"
                value={formData.tiempo_minimo_meses}
                onChange={(e) => handleChange('tiempo_minimo_meses', parseInt(e.target.value) || 12)}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tiempo Máximo (meses)"
                type="number"
                value={formData.tiempo_maximo_meses}
                onChange={(e) => handleChange('tiempo_maximo_meses', parseInt(e.target.value) || 12)}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={4}
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                placeholder="Descripción detallada del incentivo..."
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<SaveIcon />}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const GestionIncentivosTipos = () => {
  const { incentivos, loading, error, crearIncentivo, actualizarIncentivo, eliminarIncentivo } = useIncentivos();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [incentivoSeleccionado, setIncentivoSeleccionado] = useState(null);

  const handleNuevoIncentivo = () => {
    setIncentivoSeleccionado(null);
    setModalAbierto(true);
  };

  const handleEditarIncentivo = (incentivo) => {
    setIncentivoSeleccionado(incentivo);
    setModalAbierto(true);
  };

  const handleEliminarIncentivo = async (incentivo) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar Incentivo?',
      text: `¿Está seguro de eliminar "${incentivo.nombre}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      const resultado = await eliminarIncentivo(incentivo.id_incentivo);
      if (resultado.success) {
        Swal.fire('Eliminado', 'El incentivo ha sido eliminado', 'success');
      } else {
        Swal.fire('Error', resultado.message || 'No se pudo eliminar el incentivo', 'error');
      }
    }
  };

  const handleGuardarIncentivo = async (datos) => {
    if (incentivoSeleccionado) {
      return await actualizarIncentivo(incentivoSeleccionado.id_incentivo, datos);
    } else {
      return await crearIncentivo(datos);
    }
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setIncentivoSeleccionado(null);
  };

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar incentivos: {error}
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
             Gestión de Tipos de Incentivos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNuevoIncentivo}
            >
              Nuevo Incentivo
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Frecuencia</TableCell>
                    <TableCell>Duración</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incentivos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No hay incentivos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    incentivos.map((incentivo) => (
                      <TableRow key={incentivo.id_incentivo}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {incentivo.nombre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 300 }}>
                            {incentivo.descripcion?.substring(0, 100)}
                            {incentivo.descripcion?.length > 100 && '...'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            Cada {incentivo.frecuencia_informe_dias} días
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {incentivo.tiempo_minimo_meses} - {incentivo.tiempo_maximo_meses} meses
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={incentivo.estado || 'ACTIVO'}
                            color={incentivo.estado === 'ACTIVO' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditarIncentivo(incentivo)}
                            title="Editar"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminarIncentivo(incentivo)}
                            title="Eliminar"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <FormIncentivoModal
        open={modalAbierto}
        onClose={handleCerrarModal}
        incentivo={incentivoSeleccionado}
        onGuardar={handleGuardarIncentivo}
      />
    </>
  );
};

export default GestionIncentivosTipos; 