import React, { useState } from "react";
import {
    Box, Typography, TextField, Paper, Button, Divider, Collapse,
    IconButton, Pagination
} from "@mui/material";
import { PageBreadcrumb } from "components";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { useCualificaciones } from "./useCualificaciones";

const CualificacionesPage = () => {
    const theme = useTheme();
    const esMovil = useMediaQuery(theme.breakpoints.down("sm"));
    const rawUsuario = localStorage.getItem("Usuario");
    const usuario = rawUsuario ? JSON.parse(rawUsuario) : null;
    const idUsuario = usuario?.id_usuario;

    const { cualificaciones, loading, error } = useCualificaciones(idUsuario);
    const [seleccionada, setSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [menuAbierto, setMenuAbierto] = useState(false);

    // Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 5;

    const handleSeleccion = (item) => {
        setSeleccionada(item);
        if (esMovil) setMenuAbierto(false);
    };

    if (loading) return <Typography sx={{ p: 4 }}>Cargando cualificaciones...</Typography>;
    if (error) return <Typography sx={{ p: 4 }} color="error">Error: {error}</Typography>;

    const cualificacionesFiltradas = cualificaciones.filter((cual) =>
        cual.titulo.toLowerCase().includes(busqueda.toLowerCase())
    );

    const totalPaginas = Math.ceil(cualificacionesFiltradas.length / elementosPorPagina);
    const inicio = (paginaActual - 1) * elementosPorPagina;
    const cualificacionesPaginadas = cualificacionesFiltradas.slice(inicio, inicio + elementosPorPagina);

    return (
        <Box component="main" sx={{ flexGrow: 1 }}>
            <PageBreadcrumb title="Mis cualificaciones" subName="App" />
            <Paper
                elevation={2}
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    minHeight: "60vh",
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                {/* Menú móvil */}
                {esMovil && (
                    <Box p={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="warning"
                            startIcon={<MenuIcon />}
                            onClick={() => setMenuAbierto(!menuAbierto)}
                        >
                            {menuAbierto ? "Ocultar lista" : "Mostrar cualificaciones"}
                        </Button>
                        <Collapse in={menuAbierto}>
                            <Box mt={2} display="flex" flexDirection="column" gap={2}>
                                <TextField
                                    fullWidth
                                    placeholder="Buscar cualificación..."
                                    size="small"
                                    value={busqueda}
                                    onChange={(e) => {
                                        setBusqueda(e.target.value);
                                        setPaginaActual(1);
                                    }}
                                />
                                <Box display="flex" gap={1}>
                                    <Button variant="outlined" startIcon={<FilterListIcon />}>
                                        Filtros
                                    </Button>
                                    <Button variant="outlined" startIcon={<DownloadIcon />}>
                                        Descargar
                                    </Button>
                                </Box>
                                {cualificacionesPaginadas.map((cual) => (
                                    <Paper
                                        key={cual.id}
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            cursor: "pointer",
                                            borderColor: seleccionada?.id === cual.id ? "primary.main" : "grey.300",
                                            bgcolor: seleccionada?.id === cual.id ? "rgba(253, 253, 16, 0.5)" : "transparent",
                                        }}
                                        onClick={() => handleSeleccion(cual)}
                                    >
                                        <Typography fontWeight="bold" fontSize={14}>
                                            {cual.titulo}
                                        </Typography>
                                        <Typography fontSize={12} color="text.secondary">
                                            {cual.institucion} • {cual.periodo}
                                        </Typography>
                                    </Paper>
                                ))}
                                {totalPaginas > 1 && (
                                    <Box display="flex" mt={3} justifyContent="center">
                                        <Pagination
                                            count={totalPaginas}
                                            page={paginaActual}
                                            onChange={(_, value) => setPaginaActual(value)}
                                            color="primary"
                                            siblingCount={0}
                                            boundaryCount={1}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Collapse>
                    </Box>
                )}

                {/* Lista en desktop */}
                {!esMovil && (
                    <Box
                        sx={{
                            width: "35%",
                            borderRight: "1px solid #e0e0e0",
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Buscar cualificación..."
                            size="small"
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                setPaginaActual(1);
                            }}
                        />
                        <Box display="flex" gap={1}>
                            <Button variant="outlined" startIcon={<FilterListIcon />}>
                                Filtros
                            </Button>
                            <Button variant="outlined" startIcon={<DownloadIcon />}>
                                Descargar
                            </Button>
                        </Box>
                        <Box display="flex" flexDirection="column" gap={2}>
                            {cualificacionesPaginadas.map((cual) => (
                                <Paper
                                    key={cual.id}
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        cursor: "pointer",
                                        borderColor: seleccionada?.id === cual.id ? "primary.main" : "grey.300",
                                        bgcolor: seleccionada?.id === cual.id ? "rgba(253, 253, 16, 0.5)" : "transparent",
                                    }}
                                    onClick={() => handleSeleccion(cual)}
                                >
                                    <Typography fontWeight="bold" fontSize={14}>
                                        {cual.titulo}
                                    </Typography>
                                    <Typography fontSize={12} color="text.secondary">
                                        {cual.institucion} • {cual.periodo}
                                    </Typography>
                                </Paper>
                            ))}
                            {totalPaginas > 1 && (
                                <Box display="flex" mt={3} justifyContent="center">
                                    <Pagination
                                        count={totalPaginas}
                                        page={paginaActual}
                                        onChange={(_, value) => setPaginaActual(value)}
                                        color="primary"
                                        siblingCount={0}
                                        boundaryCount={1}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}

                {/* Detalle */}
                <Box sx={{ flexGrow: 1, p: 4 }}>
                    {seleccionada ? (
                        <>
                            <Typography variant="h5" fontWeight="bold" mb={2}>
                                {seleccionada.titulo}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
                                <Typography><strong>Período:</strong> {seleccionada.periodo}</Typography>
                                <Typography><strong>Línea:</strong> {seleccionada.linea}</Typography>
                                <Typography><strong>Inicio:</strong> {seleccionada.inicio}</Typography>
                                <Typography><strong>Terminación:</strong> {seleccionada.fin}</Typography>
                                <Typography><strong>Horas:</strong> {seleccionada.horas} h</Typography>
                            </Box>
                            <Box mt={3}>
                                <Typography fontWeight="bold">Observaciones:</Typography>
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    {seleccionada.observaciones}
                                </Typography>
                            </Box>
                            <Box display="flex" gap={2} mt={4}>
                                <Button variant="outlined" startIcon={<VisibilityIcon />}>
                                    Ver certificado
                                </Button>
                                <Button variant="outlined" startIcon={<FileDownloadIcon />}>
                                    Descargar certificado
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Box
                            height={200}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color="text.secondary"
                            fontStyle="italic"
                        >
                            Selecciona una cualificación para ver los detalles
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default CualificacionesPage;
