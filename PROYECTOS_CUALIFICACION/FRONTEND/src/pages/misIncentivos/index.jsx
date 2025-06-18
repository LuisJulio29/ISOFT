import { useEffect, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { PageBreadcrumb, FileUploader } from 'components';
import { gsUrlApi } from '@src/config/ConfigServer';
import Swal from 'sweetalert2';
import { AiOutlineUpload } from 'react-icons/ai';

const MisIncentivos = () => {
  const [incentivos, setIncentivos] = useState([]);
  const token = localStorage.getItem('token');

  const cargarIncentivos = async () => {
    const resp = await fetch(`${gsUrlApi}/incentivos/docente`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await resp.json();
    if (resp.ok) {
      setIncentivos(data.incentivos || []);
    }
  };

  useEffect(() => { cargarIncentivos(); }, []);

  const subirPDF = async (files, id_docente_incentivo) => {
    const archivo = files[0];
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id_docente_incentivo', id_docente_incentivo);

    const resp = await fetch(`${gsUrlApi}/incentivos/reportes/subir`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (resp.ok) {
      Swal.fire('Enviado', 'Informe enviado correctamente', 'success');
    } else {
      Swal.fire('Error', 'No se pudo enviar el informe', 'error');
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <PageBreadcrumb title="Mis Incentivos" subName="App" />
      {incentivos.map((inc) => (
        <Paper key={inc.id_docente_incentivo} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>{inc.incentivo?.nombre}</Typography>
          <Typography variant="body2" gutterBottom>Tipo: {inc.incentivo?.tipo}</Typography>
          <Typography variant="body2" gutterBottom>Periodo: {new Date(inc.fecha_inicio).toLocaleDateString()} - {new Date(inc.fecha_fin).toLocaleDateString()}</Typography>
          <Typography variant="body2" gutterBottom>Frecuencia informe: {inc.frecuencia_informe_dias} días</Typography>
          <Typography variant="body2" gutterBottom>Estado: {inc.estado}</Typography>
          <FileUploader
            showPreview={false}
            icon={AiOutlineUpload}
            text="Arrastra o haz clic para subir informe (PDF)"
            iconSize={40}
            onFileUpload={(files) => subirPDF(files, inc.id_docente_incentivo)}
          />
        </Paper>
      ))}
    </Box>
  );
};

export default MisIncentivos; 