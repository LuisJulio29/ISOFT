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
    Pagination
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import { PageBreadcrumb } from "components";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ModalCargaMasiva from "./ModalCargaMasiva";
import UsuariosForm from "./UsuariosForm";

const usuariosIniciales = [
    { id: "U001", nombre: "Laura Pérez", rol: "Administrador" },
    { id: "U002", nombre: "Carlos Díaz", rol: "Docente" },
];

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState(usuariosIniciales);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorAddUser, setAnchorAddUser] = useState(null);
    const [modalCargaMasivaOpen, setModalCargaMasivaOpen] = useState(false);
    const [datosExcel, setDatosExcel] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const itemsPerPage = 10;

    const usuariosFiltrados = usuarios.filter(
        (u) =>
            u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            u.id.toLowerCase().includes(busqueda.toLowerCase())
    );

    const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const usuariosPaginados = usuariosFiltrados.slice(startIndex, startIndex + itemsPerPage);

    const abrirModal = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setUsuarioSeleccionado(null);
        setModalOpen(false);
    };

    const eliminarUsuario = () => {
        setUsuarios((prev) => prev.filter((u) => u.id !== usuarioSeleccionado.id));
        cerrarModal();
    };
    const handleCrear = () => {
        setUsuarioEditando(null);
        setMostrarFormulario(true);
    };

    const handleEditar = (usuario) => {
        setUsuarioEditando(usuario);
        setMostrarFormulario(true);
    };

    const handleCancelar = () => {
        setUsuarioEditando(null);
        setMostrarFormulario(false);
    };


    const handlePageChange = (_, value) => setPage(value);
    const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    return (
        <Box component="main" sx={{ flexGrow: 1 }}>
            {mostrarFormulario ? (
                <UsuariosForm onCancel={handleCancelar} data={usuarioEditando || {}} />
            ) : (
                <>
                    <PageBreadcrumb title="Gestión de Usuarios" subName="App" />
                    <Paper elevation={2} sx={{ borderRadius: 4, p: 4, height: "50vh", display: "flex", flexDirection: "column" }}>
                        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2} mb={4}>
                            <TextField
                                label="Buscar usuario"
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
                                <Button
                                    color="primary"
                                    startIcon={<FilterListIcon />}
                                    onClick={handleOpenMenu}
                                >
                                    Filtros
                                </Button>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                                    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, width: 250 }}>
                                        <TextField select label="Rol" defaultValue="Todos" size="small">
                                            <MenuItem value="Todos">Todos</MenuItem>
                                            <MenuItem value="Administrador">Administrador</MenuItem>
                                            <MenuItem value="Docente">Docente</MenuItem>
                                        </TextField>
                                        <TextField select label="Estado" defaultValue="Todos" size="small">
                                            <MenuItem value="Todos">Todos</MenuItem>
                                            <MenuItem value="Activo">Activo</MenuItem>
                                            <MenuItem value="Inactivo">Inactivo</MenuItem>
                                        </TextField>
                                        <Button variant="contained" onClick={handleCloseMenu}>Aplicar</Button>
                                    </Box>
                                </Menu>

                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<AddIcon />}
                                    onClick={(e) => setAnchorAddUser(e.currentTarget)}
                                >
                                    Agregar usuario
                                </Button>

                                <Menu anchorEl={anchorAddUser} open={Boolean(anchorAddUser)} onClose={() => setAnchorAddUser(null)}>
                                    <MenuItem onClick={() => { setAnchorAddUser(null); console.log("Carga individual"); }}>
                                        Carga individual
                                    </MenuItem>
                                    <MenuItem onClick={() => { setAnchorAddUser(null); setModalCargaMasivaOpen(true); }}>
                                        Carga masiva
                                    </MenuItem>
                                </Menu>

                            </Box>
                        </Box>

                        <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 1 }}>
                            {usuariosPaginados.length > 0 ? (
                                usuariosPaginados.map((user) => (
                                    <Paper
                                        key={user.id}
                                        variant="outlined"
                                        sx={{
                                            p: 3,
                                            mb: 2,
                                            borderRadius: 2,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">
                                                {user.nombre}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                ID: {user.id}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Rol: {user.rol}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" gap={1}>
                                            <IconButton color="primary" onClick={() => handleEditar(usuarios)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => abrirModal(usuarios)}>
                                                <DeleteIcon />
                                            </IconButton>
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

                        <Box display="flex" justifyContent="center" mt={2}>
                            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                        </Box>
                    </Paper>
                </>
            )}

            <Modal open={modalOpen} onClose={cerrarModal}>
                <Box sx={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)", width: 400,
                    bgcolor: "background.paper", p: 4, borderRadius: 2, boxShadow: 24
                }}>
                    <Typography variant="h6" mb={2}>Confirmar eliminación</Typography>
                    <Typography variant="body2" mb={3}>
                        ¿Deseas eliminar el usuario "{usuarioSeleccionado?.nombre}"?
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={cerrarModal} variant="outlined">Cancelar</Button>
                        <Button onClick={eliminarUsuario} variant="contained" color="error">Eliminar</Button>
                    </Box>
                </Box>
            </Modal>
            <ModalCargaMasiva
                open={modalCargaMasivaOpen}
                onClose={() => setModalCargaMasivaOpen(false)}
                onDataParsed={(datos) => {
                    console.log("Datos cargados:", datos);

                }}
            />

        </Box>
    );
};

export default GestionUsuarios;
