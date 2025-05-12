import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Modal,
  Menu,
  Pagination,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import { PageBreadcrumb } from "components";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import FormacionesForm from "./FormacionesForm"; // ajusta la ruta según tu estructura

const formacionesIniciales = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  titulo: `Formación ${i + 1}`,
  institucion: `Institución ${i + 1}`,
  año: 2020 + (i % 5),
  modalidad: i % 2 === 0 ? "Presencial" : "Virtual",
}));

const GestionFormaciones = () => {
  const [formaciones, setFormaciones] = useState(formacionesIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [formacionSeleccionada, setFormacionSeleccionada] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formacionEditando, setFormacionEditando] = useState(null);

  const itemsPerPage = 10;
  const formacionesFiltradas = formaciones.filter((f) =>
    f.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    f.institucion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPages = Math.ceil(formacionesFiltradas.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const formacionesPaginadas = formacionesFiltradas.slice(startIndex, startIndex + itemsPerPage);

  const abrirModal = (formacion) => {
    setFormacionSeleccionada(formacion);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setFormacionSeleccionada(null);
  };

  const eliminarFormacion = () => {
    setFormaciones((prev) => prev.filter((f) => f.id !== formacionSeleccionada.id));
    cerrarModal();
  };


  const handlePageChange = (_, value) => setPage(value);
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);



  return (

    <Box component="main" sx={{ flexGrow: 1 }}>
      {mostrarFormulario ? (
        <FormacionesForm
          data={formacionEditando || {}}
          onCancel={() => setMostrarFormulario(false)}
        />

      ) : (
        <>
          <PageBreadcrumb title="Gestión de Formaciones" subName="App" />

          <Paper elevation={2} sx={{ borderRadius: 4, p: 4, height: "50vh", display: "flex", flexDirection: "column" }}>
            {/* Filtros y acciones */}
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2} mb={4}>
              <TextField
                label="Buscar formación"
                variant="outlined"
                size="small"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPage(1); // reinicia la página cuando se busca
                }}
                sx={{ width: { xs: "100%", md: "50%" } }}
              />
              <Box display="flex" gap={1}>
                {/* Filtro como menú estilo avatar */}
                <Button
                  color="primary"
                  startIcon={<FilterListIcon />}
                  onClick={handleOpenMenu}
                >
                  Filtros
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  slotProps={{
                    paper: {
                      elevation: 3,
                      sx: {
                        mt: 1.5,
                        minWidth: 600, // más ancho
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
                      flexDirection: "row", // en fila
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap", // por si se reduce la pantalla
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

                    <Button variant="contained" color="primary" onClick={handleCloseMenu}>
                      Aplicar
                    </Button>
                  </Box>
                </Menu>

                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setFormacionEditando(null);
                    setMostrarFormulario(true);
                  }}
                >
                  Añadir formación
                </Button>

              </Box>
            </Box>

            {/* Contenedor con scroll vertical */}
            <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 1 }}>
              {formacionesPaginadas.length > 0 ? (
                formacionesPaginadas.map((formacion) => (
                  <Paper
                    key={formacion.id}
                    variant="outlined"
                    sx={{
                      p: 3,
                      mb: 2,
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      minHeight: 80,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {formacion.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Institución:</strong> {formacion.institucion}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Año:</strong> {formacion.año}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Modalidad:</strong> {formacion.modalidad}
                      </Typography>
                    </Box>

                    <Box display="flex" gap={1}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setFormacionEditando(formacion);
                          setMostrarFormulario(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => abrirModal(formacion)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height={200}
                  width="100%"
                >
                  <Typography variant="body1" color="text.secondary">
                    No hay coincidencias
                  </Typography>
                </Box>
              )}
            </Box>


            {/* Paginación */}
            <Box display="flex" justifyContent="center">
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
            </Box>
          </Paper>

          {/* Modal */}
          <Modal open={modalOpen} onClose={cerrarModal}>
            <Box sx={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)", width: 400,
              bgcolor: "background.paper", p: 4, borderRadius: 2, boxShadow: 24
            }}>
              <Typography variant="h6" mb={2}>Confirmar eliminación</Typography>
              <Typography variant="body2" mb={3}>
                ¿Deseas eliminar la formación "{formacionSeleccionada?.titulo}"?
              </Typography>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={cerrarModal} variant="outlined">Cancelar</Button>
                <Button onClick={eliminarFormacion} variant="contained" color="error">Eliminar</Button>
              </Box>
            </Box>
          </Modal>
        </>
      )}
    </Box>




  );
};

export default GestionFormaciones;
