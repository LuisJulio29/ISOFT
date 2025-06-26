import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import { FaEdit } from "react-icons/fa";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { GiBookmark } from "react-icons/gi";
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Paper,
  TextField,
  Typography,
  Menu,
  MenuItem,
  Tooltip
} from "@mui/material";
import { PageBreadcrumb } from "components";
import { useState } from "react";
import Swal from 'sweetalert2';
import { useFiltrosFormaciones } from './useFiltrosFormaciones';
import FiltrosFormaciones from './filtrosFormaciones';
import FormacionesForm from "./FormacionesForm";
import { useFormaciones } from "./useFormaciones";
import ModalCargaMasiva from "./modalCargaMasiva";

const GestionFormaciones = () => {
  const {
    formaciones,
    crearFormacion,
    eliminarFormacion,
    actualizarFormacion,
    cargarFormacionesMasivo
  } = useFormaciones();

  const {
    filtros,
    setFiltros,
    formacionesFiltradas,
    descargarExcel,
  } = useFiltrosFormaciones(formaciones);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorAddMenu, setAnchorAddMenu] = useState(null);

  const [page, setPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");


  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formacionEditando, setFormacionEditando] = useState(null);
  const [modalCargaAbierto, setModalCargaAbierto] = useState(false);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(formacionesFiltradas.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const formacionesPaginadas = formacionesFiltradas.slice(startIndex, startIndex + itemsPerPage);
  const totalItems = formacionesFiltradas.length;
  const itemsMostrados = startIndex + formacionesPaginadas.length;

  const handlePageChange = (_, value) => setPage(value);
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const confirmarEliminacion = (formacion) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la formación "${formacion.nombre_formacion}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const respuesta = await eliminarFormacion(formacion.id_formacion);

        if (respuesta.success) {
          Swal.fire('Eliminado', 'La formación fue eliminada correctamente.', 'success');
        } else {
          Swal.fire('Error', respuesta.mensaje || 'No se pudo eliminar.', 'error');
        }
      }
    });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        pr: 1,
        scrollbarWidth: "thin",
        scrollbarColor: "#ccc transparent",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#b0b0b0",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#888",
        },
      }}
    >

      {mostrarFormulario ? (
        <FormacionesForm
          data={formacionEditando || {}}
          onCancel={() => setMostrarFormulario(false)}
          cerrarFormulario={() => setMostrarFormulario(false)}
          crearFormacion={crearFormacion}
          actualizarFormacion={actualizarFormacion}
          modoEdicion={!!formacionEditando}
        />
      ) : (
        <>
          <PageBreadcrumb title="Gestión de Formaciones" subName="App" />

          <Paper elevation={2} sx={{ borderRadius: 4, p: 4 }}>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2} mb={4}>
              <TextField
                label="Buscar formación"
                variant="outlined"
                size="small"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPage(1);
                }}
                sx={{ width: { xs: "100%", md: "50%" } }}
              />
              <Box display="flex" gap={1}>
                <Button color="primary" startIcon={<FilterListIcon />} onClick={handleOpenMenu}>
                  Filtros
                </Button>
                <FiltrosFormaciones
                  anchorEl={anchorEl}
                  handleClose={handleCloseMenu}
                  onAplicarFiltros={(nuevosFiltros) => setFiltros(nuevosFiltros)}
                  formaciones={formaciones}
                  onDescargar={descargarExcel}
                />

                <Button
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  endIcon={<ArrowDropDownIcon />}
                  onClick={(e) => setAnchorAddMenu(e.currentTarget)}
                >
                  Añadir formación
                </Button>

                <Menu
                  anchorEl={anchorAddMenu}
                  open={Boolean(anchorAddMenu)}
                  onClose={() => setAnchorAddMenu(null)}
                >
                  <MenuItem
                    onClick={() => {
                      setFormacionEditando(null);
                      setMostrarFormulario(true);
                      setAnchorAddMenu(null);
                    }}
                  >
                    Individual
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setModalCargaAbierto(true);
                      setAnchorAddMenu(null);
                    }}
                  >
                    Carga masiva
                  </MenuItem>
                </Menu>
              </Box>
            </Box>

            <Box
              sx={{
                maxHeight: 261,
                overflowY: "auto",
                pr: 1,
                scrollbarWidth: "thin",
                scrollbarColor: "#ccc transparent",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#b0b0b0",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#888",
                },
              }}
            >
              {formacionesPaginadas.length > 0 ? (
                formacionesPaginadas.map((formacion) => (
                  <Paper
                    key={formacion.id_formacion}
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
                    <Box display="flex" alignItems="center" gap={2}>
                      <GiBookmark size={28} />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {formacion.nombre_formacion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Periodo:</strong> {formacion.periodo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Línea:</strong> {formacion.linea_cualificacion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Horas:</strong> {formacion.numero_horas}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" gap={1}>
                      <Tooltip title="Editar formación" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setFormacionEditando(formacion);
                            setMostrarFormulario(true);
                          }}
                        >
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar formación" arrow>
                        <IconButton
                          color="error"
                          onClick={() => confirmarEliminacion(formacion)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>

                ))
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                  <Typography variant="body1" color="text.secondary">
                    No hay coincidencias
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              alignItems="center"
              justifyContent="center"
              mt={3}
              gap={1}
              position="relative"
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                siblingCount={0}
                boundaryCount={1}
              />

              <Box
                sx={{
                  position: { xs: "static", sm: "absolute" },
                  top: { sm: "50%" },
                  right: { sm: 0 },
                  transform: { sm: "translateY(-50%)" },
                  textAlign: { xs: "center", sm: "right" },
                  width: { xs: "100%", sm: "auto" },
                  pr: { sm: 1 },
                  mt: { xs: 1, sm: 0 },
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Mostrando {itemsMostrados} de {totalItems}
                </Typography>
              </Box>
            </Box>

          </Paper>
        </>
      )}

      <ModalCargaMasiva
        open={modalCargaAbierto}
        onClose={() => setModalCargaAbierto(false)}
        cargarFormacionesMasivo={cargarFormacionesMasivo}
      />
    </Box>
  );
};

export default GestionFormaciones;
