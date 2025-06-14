import React, { useState } from "react";
import {
    Grid,
    TextField,
    Button,
    Typography,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Box,
    Menu,
    Pagination,
    IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { PageBreadcrumb } from "components";
import DocentesForm from "./DocentesForm"; // ajusta la ruta según tu estructura



const CaracterizacionDocentes = () => {
    const docentesOriginales = [
        { nombre: "Ruben Basquez", cedula: "FS06", facultad: "Piedra Bolivar", ingreso: "2023" },
        { nombre: "Pinguinos Cartagena", cedula: "FS05", facultad: "Centro", ingreso: "2022" },
        { nombre: "Hotel Las Islas", cedula: "FS04", facultad: "Zaragocilla", ingreso: "2022" },
        // Puedes agregar más docentes aquí
    ];

    // Estados
    const [busqueda, setBusqueda] = useState("");
    const [facultadFiltro, setFacultadFiltro] = useState("Todas");
    const [ingresoFiltro, setIngresoFiltro] = useState("Todos");
    const [anchorEl, setAnchorEl] = useState(null);
    const [page, setPage] = useState(1);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [docenteEditando, setDocenteEditando] = useState(null); // por si luego editas

    const itemsPerPage = 2;

    const openMenu = Boolean(anchorEl);
    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handlePageChange = (_, value) => setPage(value);

    // Filtrado
    const docentesFiltrados = docentesOriginales.filter((docente) => {
        const coincideBusqueda =
            docente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            docente.cedula.toLowerCase().includes(busqueda.toLowerCase());

        const coincideFacultad = facultadFiltro === "Todas" || docente.facultad === facultadFiltro;
        const coincideIngreso = ingresoFiltro === "Todos" || docente.ingreso === ingresoFiltro;

        return coincideBusqueda && coincideFacultad && coincideIngreso;
    });

    // Paginación real
    const totalPages = Math.ceil(docentesFiltrados.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const docentesPaginados = docentesFiltrados.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Box component="main" sx={{ flexGrow: 1 }}>
            {mostrarFormulario ? (
                <DocentesForm
                    data={docenteEditando || {}} // si más adelante agregas edición
                    onCancel={() => setMostrarFormulario(false)}
                />
            ) : (
                <>
                    <PageBreadcrumb title="Caracterización de Docentes" subName="App" />
                    <Paper elevation={2} sx={{ borderRadius: 4, p: 4, Height: "70vh" }}>
                        {/* Barra de búsqueda y filtros */}
                        <Grid container spacing={2} justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder="Buscar docente..."
                                    variant="outlined"
                                    size="small"
                                    value={busqueda}
                                    onChange={(e) => {
                                        setBusqueda(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md="auto" display="flex" gap={2}>
                                <Button
                                    color="inherit"
                                    onClick={handleOpenMenu}
                                    startIcon={<FilterListIcon />}
                                    sx={{ textTransform: "none" }}
                                >
                                    Filtros
                                </Button>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    slotProps={{
                                        paper: {
                                            elevation: 3,
                                            sx: { mt: 1.5, minWidth: 300, px: 2, py: 2 },
                                        },
                                    }}
                                >
                                    <Box
                                        component="form"
                                        noValidate
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 2,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <TextField
                                            select
                                            label="Facultad"
                                            value={facultadFiltro}
                                            onChange={(e) => {
                                                setFacultadFiltro(e.target.value);
                                                setPage(1);
                                            }}
                                            size="small"
                                            sx={{ minWidth: 180 }}
                                        >
                                            <MenuItem value="Todas">Todas</MenuItem>
                                            <MenuItem value="Piedra Bolivar">Piedra Bolivar</MenuItem>
                                            <MenuItem value="Centro">Centro</MenuItem>
                                            <MenuItem value="Zaragocilla">Zaragocilla</MenuItem>
                                        </TextField>

                                        <TextField
                                            select
                                            label="Año de ingreso"
                                            value={ingresoFiltro}
                                            onChange={(e) => {
                                                setIngresoFiltro(e.target.value);
                                                setPage(1);
                                            }}
                                            size="small"
                                            sx={{ minWidth: 150 }}
                                        >
                                            <MenuItem value="Todos">Todos</MenuItem>
                                            <MenuItem value="2023">2023</MenuItem>
                                            <MenuItem value="2022">2022</MenuItem>
                                        </TextField>

                                        <Button variant="contained" onClick={handleCloseMenu}>
                                            Aplicar
                                        </Button>
                                    </Box>
                                </Menu>

                                <Button variant="contained" color="primary" sx={{ textTransform: "none" }}>
                                    Descargar
                                </Button>
                                {/* <Button
                                    startIcon={<AddIcon />}
                                    variant="contained"
                                    color="success"
                                    sx={{ textTransform: "none" }}
                                    onClick={() => {
                                        setDocenteEditando(null);
                                        setMostrarFormulario(true);
                                    }}
                                >
                                    Agregar cualificacion
                                </Button> */}

                            </Grid>
                        </Grid>

                        {/* Cards de docentes */}
                        <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 1 }}>
                            {docentesPaginados.length > 0 ? (
                                <Grid container direction="column" spacing={2}>
                                    {docentesPaginados.map((docente, index) => (
                                        <Grid item key={index}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    minHeight: 80, // altura mínima de tarjeta
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="h6">{docente.nombre}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Cédula: <strong>{docente.cedula}</strong>
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Facultad: {docente.facultad}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" gap={1}>
                                                    <IconButton
                                                        title="Editar"
                                                        color="primary"
                                                        onClick={() => {
                                                            setDocenteEditando(docente); // pasar el docente seleccionado
                                                            setMostrarFormulario(true); // mostrar formulario
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton title="Eliminar" color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                                    <Typography variant="body1" color="text.secondary">
                                        No hay coincidencias
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Paginación */}
                        <Box display="flex" mt={2} justifyContent="center">
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                siblingCount={0}
                                boundaryCount={1}
                            />
                        </Box>
                    </Paper>
                </>
            )}
        </Box>

    );
};

export default CaracterizacionDocentes;
