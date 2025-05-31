// components/FiltrosFormaciones.js
import React from 'react';
import { Box, Button, Menu, MenuItem, TextField } from '@mui/material';

const FiltrosFormaciones = ({ anchorEl, handleClose }) => {
  const open = Boolean(anchorEl);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 600,
            px: 2,
            py: 2,
          },
        },
      }}
    >
      <Box
        component="form"
        autoComplete="off"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField select label="Tipo de Titulación" defaultValue="Todos" size="small" sx={{ minWidth: 180 }}>
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Pregrado">Pregrado</MenuItem>
          <MenuItem value="Maestría">Maestría</MenuItem>
          <MenuItem value="Doctorado">Doctorado</MenuItem>
        </TextField>

        <TextField select label="Año" defaultValue="Todos" size="small" sx={{ minWidth: 120 }}>
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
          <MenuItem value="2023">2023</MenuItem>
          <MenuItem value="2022">2022</MenuItem>
        </TextField>

        <TextField select label="Línea de Cualificación" defaultValue="Todos" size="small" sx={{ minWidth: 180 }}>
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Docencia">Docencia</MenuItem>
          <MenuItem value="Investigación">Investigación</MenuItem>
          <MenuItem value="TIC">TIC</MenuItem>
        </TextField>

        <Button variant="contained" color="primary" onClick={handleClose}>
          Aplicar
        </Button>
      </Box>
    </Menu>
  );
};

export default FiltrosFormaciones;
