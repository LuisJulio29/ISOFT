import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Paper,
    Button,
    Divider,
    Collapse,
    IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MenuIcon from "@mui/icons-material/Menu";
import { PageBreadcrumb } from "components";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const cualificacionesEjemplo = [
    {
        id: 1,
        titulo: "Maestría en Educación",
        periodo: "2022-1",
        institucion: "Universidad de Cartagena",
        linea: "Docencia",
        horas: 120,
        inicio: "2022-02-01",
        fin: "2022-06-30",
        observaciones: "Formación para formadores",
    },
    {
        id: 2,
        titulo: "Diplomado TIC",
        periodo: "2021-2",
        institucion: "SENA",
        linea: "TIC",
        horas: 60,
        inicio: "2021-08-15",
        fin: "2021-10-15",
        observaciones: "A distancia",
    },
];

const CualificacionesPage = () => {
    const [cualificaciones] = useState(cualificacionesEjemplo);
    const [seleccionada, setSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [menuAbierto, setMenuAbierto] = useState(false);

    const theme = useTheme();
    const esMovil = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSeleccion = (item) => {
        setSeleccionada(item);
        if (esMovil) setMenuAbierto(false); // cerrar menú en móvil tras selección
    };

    return (
        <Box component="main" sx={{ flexGrow: 1 }}>
            <PageBreadcrumb title="Mis cualificaciones" subName="App" />

            <Paper
                elevation={2}
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    height: "auto",
                    minHeight: "60vh",
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                {/* Menú desplegable solo visible en móviles */}
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
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                                <Box display="flex" gap={1}>
                                    <Button variant="outlined" startIcon={<FilterListIcon />}>
                                        Filtros
                                    </Button>
                                    <Button variant="outlined" startIcon={<DownloadIcon />}>
                                        Descargar
                                    </Button>
                                </Box>
                                {cualificaciones.map((cual) => (
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
                            </Box>
                        </Collapse>
                    </Box>
                )}

                {/* Lista lateral visible solo en pantallas md+ */}
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
                            onChange={(e) => setBusqueda(e.target.value)}
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
                            {cualificaciones.map((cual) => (
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
                        </Box>
                    </Box>
                )}

                {/* Panel de detalle: se adapta al resto del ancho */}
                <Box sx={{ flexGrow: 1, p: 4 }}>
                    {seleccionada ? (
                        <>
                            <Typography variant="h5" fontWeight="bold" mb={2}>
                                {seleccionada.titulo}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box
                                display="grid"
                                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
                                gap={2}
                                fontSize={14}
                            >
                                <Typography><strong>Período:</strong> {seleccionada.periodo}</Typography>
                                <Typography><strong>Institución:</strong> {seleccionada.institucion}</Typography>
                                <Typography><strong>Línea:</strong> {seleccionada.linea}</Typography>
                                <Typography><strong>Horas:</strong> {seleccionada.horas} h</Typography>
                                <Typography><strong>Inicio:</strong> {seleccionada.inicio}</Typography>
                                <Typography><strong>Terminación:</strong> {seleccionada.fin}</Typography>
                            </Box>

                            <Box mt={3}>
                                <Typography fontWeight="bold" variant="body2">
                                    Observaciones:
                                </Typography>
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
