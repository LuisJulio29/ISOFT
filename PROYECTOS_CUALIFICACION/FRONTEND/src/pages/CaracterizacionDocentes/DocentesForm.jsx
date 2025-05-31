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
import { PageBreadcrumb } from "components";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';

const opcionesFormacion = [
    { id: 1, titulo: "Maestría en Educación", institucion: "Universidad de Cartagena", año: 2020, modalidad: "Presencial" },
    { id: 2, titulo: "Diplomado en Docencia", institucion: "Universidad del Atlántico", año: 2018, modalidad: "Virtual" },
    { id: 3, titulo: "Especialización TIC", institucion: "UNAD", año: 2019, modalidad: "Virtual" },
];

const DocentesForm = ({ data = {}, onCancel }) => {
    const [formData, setFormData] = useState({
        primerNombre: data.primerNombre || "",
        segundoNombre: data.segundoNombre || "",
        primerApellido: data.primerApellido || "",
        segundoApellido: data.segundoApellido || "",
        cedula: data.cedula || "",
        tipoDocumento: data.tipoDocumento || "",
        correo: data.correo || "",
        celular: data.celular || "",
        facultad: data.facultad || "",
        programa: data.programa || "",
        tipoVinculacion: data.tipoVinculacion || "",
        categoria: data.categoria || "",
        nivelFormacion: data.nivelFormacion || "",
        formaciones: data.formaciones || [],
    });

    const [formacionSeleccionada, setFormacionSeleccionada] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAgregarFormacion = () => {
        const seleccion = opcionesFormacion.find(f => f.id === parseInt(formacionSeleccionada));
        if (seleccion && !formData.formaciones.some(f => f.id === seleccion.id)) {
            setFormData(prev => ({
                ...prev,
                formaciones: [...prev.formaciones, seleccion],
            }));
            setFormacionSeleccionada(""); // limpiar selección
        }
    };
    return (
        <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
            <PageBreadcrumb title="Caracterización de docentes" subName="App" />
            <Paper elevation={2} sx={{ borderRadius: 4, p: 4, minHeight: "100%" }}>
                <Box display="flex" flexDirection="column" gap={3}>
                    <Divider sx={{ my: 1 }}>
                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                            DATOS PERSONALES
                        </Typography>
                    </Divider>

                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        flexWrap="wrap"
                        gap={3}
                    >
                        <TextField fullWidth label="Primer Nombre" name="primerNombre" value={formData.primerNombre} onChange={handleChange} sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }} />
                        <TextField fullWidth label="Segundo Nombre" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }} />
                        <TextField fullWidth label="Primer Apellido" name="primerApellido" value={formData.primerApellido} onChange={handleChange} sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }} />
                        <TextField fullWidth label="Segundo Apellido" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }} />
                    </Box>

                    {/* Fila 2 */}
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        flexWrap="wrap"
                        gap={3}
                    >                        <TextField fullWidth label="Cédula" name="cedula" value={formData.cedula} onChange={handleChange} sx={{ flex: 1 }} />
                        <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel>Tipo de Documento</InputLabel>
                            <Select label="Tipo de Documento" name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}>
                                <MenuItem value="CC">CC</MenuItem>
                                <MenuItem value="CE">CE</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField fullWidth label="Correo institucional" name="correo" type="email" value={formData.correo} onChange={handleChange} sx={{ flex: 1 }} />
                        <TextField fullWidth label="Celular" name="celular" type="tel" value={formData.celular} onChange={handleChange} sx={{ flex: 1 }} />
                    </Box>

                    {/* Fila 3 */}
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        flexWrap="wrap"
                        gap={3}
                    >                        <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel>Facultad</InputLabel>
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
                            <InputLabel>Programa</InputLabel>
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
                            <InputLabel>Tipo de Vinculación</InputLabel>
                            <Select label="Tipo de Vinculación" name="tipoVinculacion" value={formData.tipoVinculacion} onChange={handleChange}>
                                <MenuItem value="Planta">Planta</MenuItem>
                                <MenuItem value="Cátedra">Cátedra</MenuItem>
                                <MenuItem value="Otro">Otro</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField fullWidth label="Categoría" name="categoria" value={formData.categoria} onChange={handleChange} sx={{ flex: 1 }} />
                    </Box>

                    {/* Fila 4 */}
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        flexWrap="wrap"
                        gap={3}
                    >                        <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel>Nivel de Formación</InputLabel>
                            <Select label="Nivel de Formación" name="nivelFormacion" value={formData.nivelFormacion} onChange={handleChange}>
                                <MenuItem value="Pregrado">Pregrado</MenuItem>
                                <MenuItem value="Especialización">Especialización</MenuItem>
                                <MenuItem value="Maestría">Maestría</MenuItem>
                                <MenuItem value="Doctorado">Doctorado</MenuItem>
                                <MenuItem value="Otro">Otro</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Divider sx={{ my: 5 }}>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                        INFORMACIÓN DE CUALIFICACIÓN
                    </Typography>
                </Divider>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <FormControl fullWidth>
                        <InputLabel>Seleccionar formación</InputLabel>
                        <Select
                            label="Seleccionar formación"
                            value={formacionSeleccionada}
                            onChange={(e) => setFormacionSeleccionada(e.target.value)}
                        >
                            {opcionesFormacion.map(f => (
                                <MenuItem key={f.id} value={f.id}>
                                    {f.titulo} - {f.institucion}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<AddIcon />}
                        onClick={handleAgregarFormacion}
                        disabled={!formacionSeleccionada}
                        sx={{ borderRadius: 100 }}
                    >
                        Añadir Formación
                    </Button>
                </Box>

                {/* Lista de formaciones añadidas */}
                <Box display="flex" flexDirection="column" gap={2}>
                    {formData.formaciones.map((formacion, index) => (
                        <Box
                            key={formacion.id || index}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            p={2}
                            borderRadius={2}
                            bgcolor="#f3f4f6"
                            boxShadow={1}
                        >
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {formacion.titulo}
                                </Typography>
                                <Typography variant="body2">Institución: {formacion.institucion}</Typography>
                                <Typography variant="body2">Año: {formacion.año}</Typography>
                                <Typography variant="body2">Modalidad: {formacion.modalidad}</Typography>
                            </Box>
                            <Button title="Adjuntar archivo">
                                <AttachFileIcon />
                            </Button>
                        </Box>
                    ))}
                </Box>
                <Divider sx={{ my: 4 }} />
                <Box display="flex" justifyContent="center" gap={2}>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={onCancel}>
                        Volver
                    </Button>
                    <Button variant="contained" color="success" startIcon={<DoneAllIcon />}>
                        Guardar
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default DocentesForm;
