import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import { LuFileSpreadsheet } from "react-icons/lu";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Paper,
  TextField,
  Typography,
  Menu,
  MenuItem
} from "@mui/material";
import { PageBreadcrumb } from "components";
import { useState } from "react";
import Swal from 'sweetalert2';
import FiltrosFormaciones from './filtrosFormaciones';
import FormacionesForm from "./FormacionesForm";
import { useFormaciones } from "./useFormaciones";

const GestionFormaciones = () => {
  const {
    formaciones,
    crearFormacion,
    eliminarFormacion,
    actualizarFormacion,
    cargarFormacionesMasivo
  } = useFormaciones();
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formacionEditando, setFormacionEditando] = useState(null);
  const [anchorAddMenu, setAnchorAddMenu] = useState(null);
  const [filtros, setFiltros] = useState({
    linea: 'Todos',
    periodo: 'Todos',
    horas: 'Todos'
  });

  const itemsPerPage = 10;
  const formacionesFiltradas = formaciones
    .filter((f) =>
      (f.nombre_formacion?.toLowerCase() || '').includes(busqueda.toLowerCase()) ||
      (f.linea_cualificacion?.toLowerCase() || '').includes(busqueda.toLowerCase())
    )
    .filter((f) => {
      const lineaOk = filtros.linea === 'Todos' || f.linea_cualificacion === filtros.linea;
      const periodoOk = filtros.periodo === 'Todos' || f.periodo === filtros.periodo;
      const horasOk = filtros.horas === 'Todos' || String(f.numero_horas) === filtros.horas;
      return lineaOk && periodoOk && horasOk;
    });

  const totalPages = Math.ceil(formacionesFiltradas.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const formacionesPaginadas = formacionesFiltradas.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (_, value) => setPage(value);
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleCargaArchivo = async (event) => {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const resultado = await cargarFormacionesMasivo(archivo);

    Swal.fire({
      icon: resultado.success ? "success" : "error",
      title: resultado.success ? "Carga exitosa" : "Error",
      text: resultado.mensaje,
    });
  };

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
        />

      ) : (
        <>
          <PageBreadcrumb title="Gestión de Formaciones" subName="App" />

          <Paper elevation={2} sx={{ borderRadius: 4, p: 4, height: "52vh", display: "flex", flexDirection: "column", }}>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2} mb={4}>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                id="input-carga-masiva"
                onChange={handleCargaArchivo}
                style={{ display: 'none' }}
              />
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
                <FiltrosFormaciones anchorEl={anchorEl} handleClose={handleCloseMenu} onAplicarFiltros={(nuevosFiltros) => setFiltros(nuevosFiltros)} />


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
                      document.getElementById("input-carga-masiva").click();
                      setAnchorAddMenu(null);
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      {/* <LuFileSpreadsheet size={18} /> */}
                      Carga masiva
                    </Box>
                  </MenuItem>
                </Menu>


              </Box>
            </Box>

            {/* Contenedor con scroll vertical */}
            <Box
              sx={{
                maxHeight: 500, overflowY: "auto", pr: 1, scrollbarWidth: "thin", scrollbarColor: "#ccc transparent",
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
                      <IconButton
                        onClick={() => confirmarEliminacion(formacion)}
                        color="error"
                      >
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
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
            </Box>
          </Paper>

        </>
      )}
    </Box>
  );
};

export default GestionFormaciones;
