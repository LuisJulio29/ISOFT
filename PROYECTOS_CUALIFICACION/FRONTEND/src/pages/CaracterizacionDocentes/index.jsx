import React, { useState } from "react";
import {
    Grid,
    TextField,
    Button,
    Typography,
    Paper,
    Menu,
    Box,
    Pagination,
    IconButton,
    CircularProgress,
    MenuItem
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { FaEdit } from "react-icons/fa";
import { PageBreadcrumb } from "components";
import DocentesForm from "./DocentesForm";
import { useCaracterizacionDocentes } from "./useCaracterizacionDocentes";
import { FaUserTie } from "react-icons/fa6";
import { useFiltros } from "./useFiltros";
import FiltrosCualificacion from "./FiltrosCualificacion";
const itemsPerPage = 10;

const CaracterizacionDocentes = () => {
    const {
        docentes,
        loading,
        error,
    } = useCaracterizacionDocentes();

    const [anchorEl, setAnchorEl] = useState(null);
    const [page, setPage] = useState(1);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [docenteEditando, setDocenteEditando] = useState(null);
    const openMenu = Boolean(anchorEl);
    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);
    const handlePageChange = (_, value) => setPage(value);

    const {
        busqueda,
        setBusqueda,
        facultadFiltro,
        setFacultadFiltro,
        programaFiltro,
        setProgramaFiltro,
        vinculacionFiltro,
        setVinculacionFiltro,
        nivelFiltro,
        setNivelFiltro,
        añoFiltro,
        setAñoFiltro,
        docentesFiltrados,
        facultades,
        programas,
        tiposVinculacion,
        nivelesFormacion,
        añosDisponibles,
        limpiarFiltros,
        descargar
    } = useFiltros(docentes);



    const totalPages = Math.ceil(docentesFiltrados.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const docentesPaginados = docentesFiltrados.slice(startIndex, startIndex + itemsPerPage);

    const handleDescargar = () => {
        const dataParaExcel = docentesFiltrados.map((docente) => {
            const formaciones = (docente.formaciones || [])
                .map((f, idx) => `Formación ${idx + 1}: ${f.titulo || f.nombre_formacion} (${f.periodo || "N/A"})`)
                .join("; ");

            return {
                Nombre: docente.nombre,
                Apellidos: docente.apellidos,
                Cédula: docente.cedula,
                Correo: docente.correo_institucional,
                Facultad: docente.facultad,
                Programa: docente.programa,
                "Tipo de Vinculación": docente.tipo_vinculacion,
                Categoría: docente.categoria,
                "Nivel de Formación": docente.nivel_formacion,
                Formaciones: formaciones,
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataParaExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Docentes");

        XLSX.writeFile(workbook, "Docentes_filtrados.xlsx");
    };
    const totalItems = docentesFiltrados.length;
    const itemsMostrados = Math.min(itemsPerPage * page, totalItems);

    return (
        <Box component="main" sx={{ flexGrow: 1 }}>
            {mostrarFormulario ? (
                <DocentesForm
                    data={docenteEditando || {}}
                    onCancel={() => {
                        setMostrarFormulario(false);
                        setDocenteEditando(null);
                    }}
                />
            ) : (
                <>
                    <PageBreadcrumb title="Caracterización de Docentes" subName="App" />
                    <Paper elevation={2} sx={{ borderRadius: 4, p: 4 }}>
                        <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            mb={3}
                            direction="row"
                            wrap={{ xs: "wrap", md: "nowrap" }}
                        >
                            <Grid item xs={12} md={8}>
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

                            <Grid
                                item
                                xs={12}
                                md={3.8}
                                display="flex"
                                justifyContent={{ xs: "flex-start", md: "flex-end" }}
                                gap={2}
                                mt={{ xs: 1, md: 0 }}
                            >
                                <Button
                                    color="primary"
                                    onClick={handleOpenMenu}
                                    startIcon={<FilterListIcon />}
                                >
                                    Filtros
                                </Button>

                                <FiltrosCualificacion
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    onDescargar={descargar}
                                    valores={{
                                        facultadFiltro, setFacultadFiltro,
                                        programaFiltro, setProgramaFiltro,
                                        vinculacionFiltro, setVinculacionFiltro,
                                        nivelFiltro, setNivelFiltro,
                                        añoFiltro, setAñoFiltro,
                                        facultades,
                                        programas,
                                        tiposVinculacion,
                                        nivelesFormacion,
                                        añosDisponibles,
                                        limpiarFiltros,
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* Loader o Lista */}
                        {loading ? (
                            <Box display="flex" justifyContent="center" mt={4}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Box display="flex" justifyContent="center" mt={4}>
                                <Typography color="error">{error}</Typography>
                            </Box>
                        ) : docentesPaginados.length > 0 ? (
                            <>
                                {/* Lista con scroll */}
                                <Box sx={{ maxHeight: 260, overflowY: "auto", pr: 1 }}>
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
                                                        minHeight: 80,
                                                    }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <FaUserTie size={28} />

                                                        <Box>
                                                            <Typography variant="h6" fontWeight="bold">
                                                                {`${docente.nombre} ${docente.apellidos}`}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <strong>Cédula:</strong>{docente.cedula}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <strong>Correo:</strong> {docente.correo_institucional}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <strong>Programa:</strong> {docente.programa || "N/A"}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box display="flex" gap={1}>
                                                        <IconButton
                                                            title="Editar cualificación"
                                                            color="primary"
                                                            onClick={() => {
                                                                setDocenteEditando(docente);
                                                                setMostrarFormulario(true);
                                                            }}
                                                        >
                                                            <FaEdit />
                                                        </IconButton>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
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
                            </>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                                <Typography variant="body1" color="text.secondary">
                                    No hay coincidencias
                                </Typography>
                            </Box>
                        )}

                        {/* Paginación */}
                        {!loading && totalPages > 1 && (
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
                        )}
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default CaracterizacionDocentes;
