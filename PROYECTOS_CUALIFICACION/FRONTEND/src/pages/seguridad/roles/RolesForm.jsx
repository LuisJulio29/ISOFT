import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  FormGroup
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { DoneAll } from "@mui/icons-material";

const permisosList = [
  "Caracterización de docentes",
  "Gestión de formaciones",
  "Mi cuenta",
  "Seguridad",
  "Roles y permisos",
];

const RolForm = ({ rol, reset }) => {
  const [formData, setFormData] = useState(rol);
  const [permisos, setPermisos] = useState({});

  useEffect(() => {
    setFormData(rol);
  }, [rol]);

  const handleCheckboxChange = (permiso) => {
    setPermisos((prev) => ({
      ...prev,
      [permiso]: !prev[permiso],
    }));
  };

  return (
    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h6">Editar {formData.nombre}</Typography>

      <TextField
        fullWidth
        label="Código del rol"
        value={formData.codigo}
        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
      />

      <TextField
        fullWidth
        label="Nombre del rol"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
      />

      <Divider sx={{ fontFamily: "'Poppins','Roboto',sans-serif" }}>
        Permisos por vista
      </Divider>

      <FormGroup row>
        {permisosList.map((permiso) => (
          <FormControlLabel
            key={permiso}
            control={
              <Checkbox
                checked={!!permisos[permiso]}
                onChange={() => handleCheckboxChange(permiso)}
              />
            }
            label={permiso}
          />
        ))}
      </FormGroup>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="contained" onClick={reset} color="error" startIcon={<Cancel />}> 
          Cancelar
        </Button>
        <Button variant="contained" color="success" type="submit" startIcon={<DoneAll />}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default RolForm;
