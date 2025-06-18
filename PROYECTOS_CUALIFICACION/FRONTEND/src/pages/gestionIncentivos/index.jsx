import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Box, Button, IconButton, Paper, TextField, Typography } from '@mui/material';
import { PageBreadcrumb } from 'components';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useIncentivos } from './useIncentivos';
import IncentivosForm from './IncentivosForm';

const GestionIncentivos = () => {
  const {
    incentivos,
    crearIncentivo,
    actualizarIncentivo,
    eliminarIncentivo,
    asignarIncentivo,
  } = useIncentivos();

  const [busqueda, setBusqueda] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);

  const incentivosFiltrados = incentivos.filter((i) =>
    (i.nombre?.toLowerCase() || '').includes(busqueda.toLowerCase())
  );

  const handleEliminar = (incentivo) => {
    Swal.fire({
      title: '¿Eliminar incentivo?',
      text: incentivo.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    }).then(async (r) => {
      if (r.isConfirmed) {
        const res = await eliminarIncentivo(incentivo.id_incentivo);
        if (!res.success) Swal.fire('Error', res.message || 'No se pudo eliminar', 'error');
      }
    });
  };

  const handleAsignar = async (incentivo) => {
    const { value: id_docente } = await Swal.fire({
      title: 'Asignar a docente',
      input: 'text',
      inputLabel: 'ID del docente',
      showCancelButton: true,
    });
    if (!id_docente) return;

    let fecha_inicio = null;
    let fecha_fin = null;
    let frecuencia = null;

    if (incentivo.tipo === 'ANIO_SABATICO') {
      const { value: fInicio } = await Swal.fire({ title: 'Fecha de inicio', input: 'date', showCancelButton: true });
      if (!fInicio) return;
      fecha_inicio = fInicio;
      // backend calculará fin y frecuencia
    } else {
      const { value: fInicio } = await Swal.fire({ title: 'Fecha de inicio', input: 'date', showCancelButton: true });
      if (!fInicio) return;
      const { value: fFin } = await Swal.fire({ title: 'Fecha de fin', input: 'date', showCancelButton: true });
      if (!fFin) return;
      const { value: freq } = await Swal.fire({ title: 'Frecuencia informe (días)', input: 'number', inputValue: incentivo.frecuencia_informe_dias || 30, showCancelButton: true });
      if (!freq) return;
      fecha_inicio = fInicio;
      fecha_fin = fFin;
      frecuencia = parseInt(freq, 10);
    }

    const res = await asignarIncentivo({ id_incentivo: incentivo.id_incentivo, id_docente, fecha_inicio, fecha_fin, frecuencia_informe_dias: frecuencia });
    if (res.success) Swal.fire('Asignado', 'Incentivo asignado correctamente', 'success');
    else Swal.fire('Error', res.message || 'No se pudo asignar', 'error');
  };

  if (mostrarForm) {
    return (
      <IncentivosForm
        data={editando || {}}
        onCancel={() => setMostrarForm(false)}
        onSave={editando ? (datos) => actualizarIncentivo(editando.id_incentivo, datos) : crearIncentivo}
      />
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <PageBreadcrumb title="Gestión de Incentivos" subName="App" />
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Box display="flex" gap={2} mb={3}>
          <TextField label="Buscar incentivo" size="small" fullWidth value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditando(null); setMostrarForm(true); }}>Nuevo</Button>
        </Box>

        <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
          {incentivosFiltrados.map((inc) => (
            <Paper key={inc.id_incentivo} variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{inc.nombre}</Typography>
                <Typography variant="body2">Frecuencia: {inc.frecuencia_informe_dias} días</Typography>
                <Typography variant="body2">Duración mínima: {inc.tiempo_minimo_meses} meses</Typography>
                <Typography variant="body2">Duración máxima: {inc.tiempo_maximo_meses} meses</Typography>
              </Box>
              <Box display="flex" gap={1}>
                <IconButton color="primary" onClick={() => { setEditando(inc); setMostrarForm(true); }}><EditIcon /></IconButton>
                <IconButton color="secondary" onClick={() => handleAsignar(inc)}><PersonAddAltIcon /></IconButton>
                <IconButton color="error" onClick={() => handleEliminar(inc)}><DeleteIcon /></IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default GestionIncentivos; 