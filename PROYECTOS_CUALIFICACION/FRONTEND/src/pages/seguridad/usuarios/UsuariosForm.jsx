import React, { useState } from "react";
import {
    Box,
    TextField,
    Typography,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Divider,
} from "@mui/material";
import Cancel from "@mui/icons-material/Cancel";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { PageBreadcrumb } from "components";

const UsuariosForm = ({ onCancel, data = {} }) => {
    const [formData, setFormData] = useState({
        primerNombre: data.primerNombre || "",
        segundoNombre: data.segundoNombre || "",
        primerApellido: data.primerApellido || "",
        segundoApellido: data.segundoApellido || "",
        tipoDocumento: data.tipoDocumento || "",
        numeroDocumento: data.numeroDocumento || "",
        correo: data.correo || "",
        usuario: data.usuario || "",
        contraseña: data.contraseña || "",
        rol: data.rol || "",
        estado: data.estado || "activo",
        telefono: data.telefono || "",
        facultad: data.facultad || "",
        programa: data.programa || "",
        tipoVinculacion: data.tipoVinculacion || "",
        categoria: data.categoria || "",
        nivelFormacion: data.nivelFormacion || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("Datos enviados:", formData);
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
            <PageBreadcrumb title="Crear Usuario" subName="Administración" />
            <Paper elevation={2} sx={{ borderRadius: 4, p: 4 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                    REGISTRO DE NUEVO USUARIO
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>
                    {/* Fila 1 - Datos personales */}
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        flexWrap="wrap"
                        gap={3}
                    >
                        <TextField fullWidth label="Primer Nombre" name="primerNombre" value={formData.primerNombre} onChange={handleChange} sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }} />
                        <TextField fullWidth label="Segundo Nombre" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }} />
                        <TextField fullWidth label="Primer Apellido" name="primerApellido" value={formData.primerApellido} onChange={handleChange} sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }} />
                        <TextField fullWidth label="Segundo Apellido" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }} />
                    </Box>

                    {/* Fila 2 - Usuario, Contraseña, Rol */}
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        flexWrap="wrap"
                        gap={3}
                    >
                        <FormControl fullWidth sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }}>
                            <InputLabel>Tipo de Documento</InputLabel>
                            <Select
                                label="Tipo de Documento"
                                name="tipoDocumento"
                                value={formData.tipoDocumento}
                                onChange={handleChange}
                            >
                                <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                                <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                                <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                                <MenuItem value="Otro">Otro</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Número de Documento"
                            name="numeroDocumento"
                            value={formData.numeroDocumento || ""}
                            onChange={handleChange}
                            sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }}
                        />
                        <TextField fullWidth label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }} />
                        <TextField fullWidth label="Correo Electrónico" name="correo" type="email" value={formData.correo} onChange={handleChange} sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }} />
                    </Box>

                    {/* Fila 3 - Información académica/laboral */}
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        flexWrap="wrap"
                        gap={3}
                    >
                        <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel>Facultad a la que pertenece</InputLabel>
                            <Select label="Facultad" name="facultad" value={formData.facultad} onChange={handleChange}>
                                <MenuItem value="Piedra Bolívar">Sede Piedra Bolívar</MenuItem>
                                <MenuItem value="Zaragocilla">Sede Zaragocilla</MenuItem>
                                <MenuItem value="Claustro de la Merced">Sede Claustro de la Merced</MenuItem>
                                <MenuItem value="Centro">Sede Centro</MenuItem>
                                <MenuItem value="San Pablo">Sede San Pablo</MenuItem>
                                <MenuItem value="Centros Tutoriales">Centros Tutoriales</MenuItem>
                                <MenuItem value="Otro">Otro</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel>Programa al que pertenece</InputLabel>
                            <Select label="Programa" name="programa" value={formData.programa} onChange={handleChange}>
                                <MenuItem value="Sistemas">Ingeniería de Sistemas</MenuItem>
                                <MenuItem value="Civil">Ingeniería Civil</MenuItem>
                                <MenuItem value="Química">Ingeniería Química</MenuItem>
                                <MenuItem value="Derecho">Derecho</MenuItem>
                                <MenuItem value="Economía">Economía</MenuItem>
                                <MenuItem value="Contaduría">Contaduría Pública</MenuItem>
                                <MenuItem value="Enfermería">Enfermería</MenuItem>
                                <MenuItem value="Medicina">Medicina</MenuItem>
                                <MenuItem value="Fisioterapia">Fisioterapia</MenuItem>
                                <MenuItem value="Matemáticas">Matemáticas</MenuItem>
                                <MenuItem value="Biología">Biología</MenuItem>
                                <MenuItem value="Física">Física</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel>Nivel de Formación</InputLabel>
                            <Select label="Nivel de Formación" name="nivelFormacion" value={formData.nivelFormacion} onChange={handleChange}>
                                <MenuItem value="Pregrado">Pregrado</MenuItem>
                                <MenuItem value="Especialización">Especialización</MenuItem>
                                <MenuItem value="Maestría">Maestría</MenuItem>
                                <MenuItem value="Doctorado">Doctorado</MenuItem>
                                <MenuItem value="Otro">Otro</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel>Tipo de Vinculación</InputLabel>
                            <Select label="Tipo de Vinculación" name="tipoVinculacion" value={formData.tipoVinculacion} onChange={handleChange}>
                                <MenuItem value="Planta">Planta</MenuItem>
                                <MenuItem value="Cátedra">Cátedra</MenuItem>
                                <MenuItem value="Otro">Otro</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField fullWidth label="Categoría" name="categoria" value={formData.categoria} onChange={handleChange} sx={{ flex: 1 }} />
                   
                    </Box>

                    {/* Fila 4 - Nivel formación */}
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        flexWrap="wrap"
                        gap={3}
                    >
                        <TextField fullWidth label="Usuario" name="usuario" value={formData.usuario} onChange={handleChange} sx={{ flex: 1 }} />
                        <TextField fullWidth label="Contraseña" name="contraseña" type="password" value={formData.contraseña} onChange={handleChange} sx={{ flex: 1 }} />
                        <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel>Rol</InputLabel>
                            <Select label="Rol" name="rol" value={formData.rol} onChange={handleChange}>
                                <MenuItem value="admin">Administrador</MenuItem>
                                <MenuItem value="editor">Docente</MenuItem>
                                <MenuItem value="consultor">Master</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box display="flex" justifyContent="center" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
                    <Button variant="contained" color="error" startIcon={<Cancel />} onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="success" startIcon={<DoneAllIcon />} onClick={handleSubmit}>
                        Crear Usuario
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default UsuariosForm;
