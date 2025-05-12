import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { PageBreadcrumb } from "components";

const FormacionesForm = ({ data = {}, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: data.nombre || data.titulo || "",
    periodo: "",
    desarrolladoPor: data.desarrolladoPor || data.institucion || "",
    linea: data.linea || "",
    horas: data.horas || "",
    fechaInicio: data.fechaInicio || "",
    fechaFin: data.fechaFin || "",
    observaciones: data.observaciones || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "40vh" }}>
      <Box sx={{ flex: 1 }}>
        <PageBreadcrumb title="Registrar Formación" subName="App" />

        <Paper elevation={3} sx={{ borderRadius: 4, p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",     // Una columna en móviles
                  md: "1fr 1fr", // Dos columnas desde pantallas medianas
                },
              }}
            >
              <TextField
                fullWidth
                label="Nombre de la formación"
                name="nombre"
                placeholder="Ej. Diplomado en TIC"
                value={formData.nombre}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Período"
                name="periodo"
                placeholder="2023-2"
                value={formData.periodo}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Desarrollado por"
                name="desarrolladoPor"
                placeholder="Ej. Universidad"
                value={formData.desarrolladoPor}
                onChange={handleChange}
              />
              <TextField
                select
                fullWidth
                label="Línea de cualificación"
                name="linea"
                value={formData.linea}
                onChange={handleChange}
              >
                <MenuItem value="">Seleccione</MenuItem>
                <MenuItem value="Docencia">Docencia</MenuItem>
                <MenuItem value="Investigación">Investigación</MenuItem>
                <MenuItem value="TIC">TIC</MenuItem>
                <MenuItem value="Administrativa">Administrativa</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Número de horas"
                name="horas"
                type="number"
                value={formData.horas}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Fecha de inicio"
                name="fechaInicio"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.fechaInicio}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Fecha de terminación"
                name="fechaFin"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.fechaFin}
                onChange={handleChange}
              />
            </Box>

            {/* Observaciones en toda la fila */}
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observaciones"
                name="observaciones"
                placeholder="Opcional..."
                value={formData.observaciones}
                onChange={handleChange}
              />
            </Box>

            {/* Botones */}
            <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
            <Button variant="outlined" color="inherit" onClick={onCancel}>
    Cancelar
  </Button>
              <Button type="submit" variant="contained" color="success">
                Guardar
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default FormacionesForm;
