import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Divider
} from "@mui/material";
import { Cancel, DoneAll } from "@mui/icons-material";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "font-awesome/css/font-awesome.min.css";

const treeData = [
  {
    value: "vistas",
    label: "Vistas",
    children: [
      { value: "caracterizacion", label: "Caracterización de docentes" },
      { value: "formaciones", label: "Gestión de formaciones" },
      { value: "cuenta", label: "Mi cuenta" },
      { value: "cualificaciones", label: "Mis cualificaciones" },
      {
        value: "seguridad",
        label: "Seguridad",
        children: [
          { value: "usuarios", label: "Usuarios" },
          { value: "roles", label: "Roles y permisos" },
        ],
      },
    ],
  },
];

const RolForm = ({ rol, reset }) => {
  const [formData, setFormData] = useState(rol);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState(["vistas", "seguridad"]);

  useEffect(() => {
    setFormData(rol);
  }, [rol]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      permisos: checked,
    };
    console.log("Rol a guardar:", payload);
    // Aquí podrías llamar a un método para guardar el rol con sus permisos
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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

      <CheckboxTree
        nodes={treeData}
        checked={checked}
        expanded={expanded}
        onCheck={(c) => setChecked(c)}
        onExpand={(e) => setExpanded(e)}
        iconsClass="fa5"
        showExpandAll
      />

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
