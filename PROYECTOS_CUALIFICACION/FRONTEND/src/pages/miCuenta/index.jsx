import React, { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Divider,
    InputAdornment
} from '@mui/material';
import {
    AccountCircle,
    Badge,
    Email,
    Phone,
    Home,
    AssignmentInd,
    Person,
    Lock,
    LockOpen,
    LockReset,
    Cancel,
    DoneAll
} from '@mui/icons-material';
import { PageBreadcrumb } from "components";

const MiCuenta = () => {
    const [mostrarCambioPassword, setMostrarCambioPassword] = useState(false);
    const [usuario, setUsuario] = useState("usuario_actual");
    const [usuarioEditado, setUsuarioEditado] = useState(usuario);

    const seHaEditado = mostrarCambioPassword || usuarioEditado !== usuario;

    return (
        <Box component="main" sx={{ flexGrow: 1 }}>
            <PageBreadcrumb title="Mi cuenta" subName="App" />
            <Paper elevation={2} sx={{ borderRadius: 4, p: 4, minHeight: "50vh" }}>
                {/* DATOS PERSONALES */}
                <Divider sx={{ mb: 3, fontWeight: 'bold', fontSize: '1rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                    DATOS PERSONALES
                </Divider>

                <Box
                    sx={{
                        display: 'grid',
                        gap: 3,
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        mb: 4
                    }}
                >
                    <TextField
                        label="Nombre completo"
                        placeholder="Escriba su nombre completo"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="Rol"
                        placeholder="Rol"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AssignmentInd />
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="Tipo de documento"
                        placeholder="Cédula, Pasaporte, etc."
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Badge />
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="Número de documento"
                        placeholder="Número"
                        editable={false}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Badge />
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>


                {/* DATOS DE CUENTA */}
                <Divider sx={{ mb: 3, fontWeight: 'bold', fontSize: '1rem' }} />

                <Box
                    sx={{
                        display: 'grid',
                        gap: 3,
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                        alignItems: 'center'
                    }}
                >
                    <TextField
                        label="Usuario"
                        placeholder="Nombre de usuario"
                        fullWidth
                        value={usuarioEditado}
                        onChange={(e) => setUsuarioEditado(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            color={mostrarCambioPassword ? 'error' : 'primary'}
                            onClick={() => setMostrarCambioPassword(!mostrarCambioPassword)}
                        >
                            {mostrarCambioPassword ? 'Mantener contraseña actual' : 'Cambiar contraseña'}
                        </Button>
                    </Box>
                </Box>

                {/* CAMBIO DE CONTRASEÑA */}
                {mostrarCambioPassword && (
                    <Box
                        sx={{
                            display: 'grid',
                            gap: 3,
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                            mt: 3
                        }}
                    >
                        <TextField
                            label="Contraseña actual"
                            type="password"
                            placeholder="Escriba su contraseña actual"
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
                        />
                        <TextField
                            label="Nueva contraseña"
                            type="password"
                            placeholder="Escriba una nueva contraseña"
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><LockOpen /></InputAdornment> }}
                        />
                        <TextField
                            label="Confirmar contraseña"
                            type="password"
                            placeholder="Repita la nueva contraseña"
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><LockReset /></InputAdornment> }}
                        />
                    </Box>
                )}

                {/* BOTONES */}
                {seHaEditado && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => {
                                setUsuarioEditado(usuario);
                                setMostrarCambioPassword(false);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<DoneAll />}
                        >
                            Guardar cambios
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default MiCuenta;
