import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Drawer,
    Pagination,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PageBreadcrumb } from "components";
import { useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import Swal from "sweetalert2";
import { useCualificaciones } from "./useCualificaciones";

const ListaCualificaciones = ({
    cualificaciones,
    seleccionada,
    onSeleccionar,
    busqueda,
    setBusqueda,
    paginaActual,
    setPaginaActual,
    totalPaginas,
}) => (
    <>

        {cualificaciones.map((cual) => (
            <Paper
                key={cual.id}
                variant="outlined"
                sx={{
                    p: 2,
                    mb: 1,
                    cursor: "pointer",
                    borderColor:
                        seleccionada?.id === cual.id
                            ? "2px solid rgb(193, 205, 27)"
                            : "1px solid #ccc",
                    bgcolor:
                        seleccionada?.id === cual.id
                            ? "rgba(202, 244, 15, 0.56)"
                            : "inherit",
                }}
                onClick={() => onSeleccionar(cual)}
            >
                <Typography fontWeight="bold" fontSize={14}>
                    {cual.titulo}
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                    {(cual.institucion || cual.linea) + " • " + cual.periodo}
                </Typography>
            </Paper>
        ))}

        {totalPaginas > 1 && (
            <Box display="flex" mt={2} justifyContent="center">
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
    </>
);

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
    const [modalAbierto, setModalAbierto] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 4;

    const mostrarErrorCertificado = () => {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se encontró un certificado para esta cualificación.",
            confirmButtonColor: "#7C4DFF",
            confirmButtonText: "Aceptar",
        });
    };

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

            <Box
                component={Paper}
                elevation={2}
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    borderRadius: 3,
                        overflow: "hidden", // asegúrate de no propagar scroll aquí
                    p: 2,
                }}
            >
                {esMovil ? (
                    <Drawer
                        anchor="right"
                        open={menuAbierto}
                        onClose={() => setMenuAbierto(false)}
                        PaperProps={{
                            sx: {
                                width: "80vw",
                                maxWidth: 220,
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                            },
                        }}
                    >
                        <ListaCualificaciones
                            cualificaciones={cualificacionesPaginadas}
                            seleccionada={seleccionada}
                            onSeleccionar={handleSeleccion}
                            busqueda={busqueda}
                            setBusqueda={setBusqueda}
                            paginaActual={paginaActual}
                            setPaginaActual={setPaginaActual}
                            totalPaginas={totalPaginas}
                        />
                    </Drawer>
                ) : (
                    <Box sx={{ width: "35%", pr: 2, display: "flex", flexDirection: "column" }}>
                        {/* Buscador fuera del scroll */}
                        <Box sx={{ mb: 2 }}>
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
                        </Box>

                        {/* Lista scrollable */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                overflowY: "auto",
                                maxHeight: "50vh",
                                scrollbarWidth: "thin",
                                "&::-webkit-scrollbar": { width: "1px" },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "#b0b0b0",
                                    borderRadius: "4px",
                                },
                            }}
                        >
                            <ListaCualificaciones
                                cualificaciones={cualificacionesPaginadas}
                                seleccionada={seleccionada}
                                onSeleccionar={handleSeleccion}
                            />
                        </Box>

                        {/* Paginación fuera del scroll */}
                        {totalPaginas > 1 && (
                            <Box display="flex" mt={2} justifyContent="center">
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
                )}
                <Box sx={{ flexGrow: 1, p: 3 }}>

                    {seleccionada ? (
                        <>
                            <Box sx={{ position: "relative", mb: 2, px: 2 }}>
                                <Typography variant="h5" fontWeight="bold" textAlign="center">
                                    {seleccionada.titulo}
                                </Typography>

                                {esMovil && (
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        startIcon={<BsFillMenuButtonWideFill />}
                                        onClick={() => setMenuAbierto(true)}
                                        sx={{
                                            position: "absolute",
                                            right: 0,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            minWidth: "auto",
                                            p: 1.2,
                                            borderRadius: 2,
                                        }}
                                    />
                                )}
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
                                gap={2}
                                mb={3}
                            >
                                <TextField label="Período" value={seleccionada.periodo} fullWidth InputProps={{ readOnly: true }} />
                                <TextField label="Línea" value={seleccionada.linea} fullWidth InputProps={{ readOnly: true }} />
                                <TextField label="Inicio" value={seleccionada.inicio} fullWidth InputProps={{ readOnly: true }} />
                                <TextField label="Terminación" value={seleccionada.fin} fullWidth InputProps={{ readOnly: true }} />
                                <TextField label="Horas" value={`${seleccionada.horas} h`} fullWidth InputProps={{ readOnly: true }} />
                            </Box>

                            <Box mt={3}>
                                <TextField
                                    label="Observaciones"
                                    value={seleccionada.observaciones || "Sin observaciones"}
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    InputProps={{ readOnly: true }}
                                />
                            </Box>

                            <Box mt={4} display="flex" justifyContent="flex-end" gap={2} flexWrap="wrap">
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => {
                                        if (seleccionada?.certificado) {
                                            setModalAbierto(true);
                                        } else {
                                            mostrarErrorCertificado();
                                        }
                                    }}
                                >
                                    Ver certificado
                                </Button>
                                {/* <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<FileDownloadIcon />}
                                    onClick={() => {
                                        if (seleccionada?.certificado) {
                                            const link = document.createElement("a");
                                            link.href = `data:application/pdf;base64,${seleccionada.certificado}`;
                                            link.download = `certificado_${seleccionada.id}.pdf`;
                                            link.click();
                                        } else {
                                            mostrarErrorCertificado();
                                        }
                                    }}
                                >
                                    Descargar certificado
                                </Button> */}
                            </Box>
                        </>
                    ) : (
                        <Box
                            height={200}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            color="text.secondary"
                            fontStyle="italic"
                            sx={{ px: 2, textAlign: "center" }}
                        >
                            {esMovil && (
                                <Button
                                    variant="contained"
                                    color="warning"
                                    startIcon={<BsFillMenuButtonWideFill size={28} />}
                                    onClick={() => setMenuAbierto(true)}
                                    sx={{
                                        mb: 2, // espacio debajo del botón
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                    }}
                                >
                                    Selecciona una cualificación para ver los detalles
                                </Button>
                            )}


                        </Box>

                    )}
                </Box>
            </Box>

            {/* Modal certificado */}
            <Dialog
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                fullWidth
                maxWidth="lg"
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: 6,
                        display: "flex",
                        flexDirection: "column",
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        px: 3,
                        py: 2,
                        borderBottom: "1px solid #e0e0e0",
                        fontWeight: "bold"
                    }}
                >
                    Certificado de {seleccionada?.titulo}
                </DialogTitle>

                <DialogContent
                    sx={{
                        flexGrow: 1,
                        p: 0,
                        backgroundColor: "transparent",
                        position: "relative",
                        height: { xs: "70vh", md: "80vh" },
                    }}
                >
                    {seleccionada?.certificado ? (
                        <iframe
                            title="Vista previa del certificado"
                            src={`data:application/pdf;base64,${seleccionada.certificado}`}
                            width="100%"
                            height="100%"
                            style={{
                                border: "none",
                                borderRadius: "0 0 8px 8px",
                            }}
                        />
                    ) : (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                            p={3}
                            textAlign="center"
                        >
                            <Typography variant="body1">
                                No hay certificado disponible para mostrar.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", p: 2 }}>
                    <Button
                        onClick={() => setModalAbierto(false)}
                        variant="contained"
                        color="error"
                    >
                        Cerrar
                    </Button>
                    {seleccionada?.certificado && (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<FileDownloadIcon />}
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = `data:application/pdf;base64,${seleccionada.certificado}`;
                                link.download = `certificado_${seleccionada.id}.pdf`;
                                link.click();
                            }}
                        >
                            Descargar PDF
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default CualificacionesPage;
