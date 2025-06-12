import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Divider
} from "@mui/material";
import { Cancel, DoneAll } from "@mui/icons-material";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "font-awesome/css/font-awesome.min.css";
import { useRoles } from "./useRoles";
import { gsUrlApi } from "@src/config/ConfigServer";

const RolForm = ({ rol, reset }) => {
  const { obtenerInterfacesPorRol, guardarInterfacesPorRol } = useRoles();
  const [formData, setFormData] = useState(rol);
  const [treeData, setTreeData] = useState([]);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState(["vistas", "seguridad"]);

  useEffect(() => {
    if (rol?.id_rol) {
      obtenerInterfacesPorRol(rol.id_rol)
        .then((data) => {
          setChecked(data.map((i) => i.id_interface));
        })
        .catch((err) => console.error("Error al cargar interfaces:", err));
    }
    setFormData(rol);
  }, [rol]);

useEffect(() => {
  fetch(`${gsUrlApi}/interfaces/buscar`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const interfaces = data.interfaces || [];

      const vistas = interfaces.filter(
        (i) => i.parent === null && i.nombre !== "Inicio"
      );

      const tree = [
        {
          value: "vistas",
          label: "Vistas",
          children: vistas.map((vista) => {
            const hijos = interfaces.filter(
              (hijo) => hijo.parent === vista.id_interface
            );
            return {
              value: vista.id_interface,
              label: vista.nombre,
              ...(hijos.length > 0 && {
                children: hijos.map((hijo) => ({
                  value: hijo.id_interface,
                  label: hijo.nombre,
                })),
              }),
            };
          }),
        },
      ];

      setTreeData(tree);
    })
    .catch((err) => console.error("Error cargando interfaces:", err));
}, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await guardarInterfacesPorRol(rol.id_rol, checked);
      alert("Permisos guardados correctamente");
    } catch (error) {
      alert("Error al guardar permisos",error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Divider sx={{ fontFamily: "'Poppins','Roboto',sans-serif" }}>
        Editar {formData.nombre}
      </Divider>

      <TextField
        fullWidth
        label="Código del rol"
        value={`R${String(formData.id_rol).padStart(3, '0')}`}
        variant="outlined"
        disabled
        InputLabelProps={{ shrink: true }}
      />


      <TextField
        fullWidth
        label="Nombre del rol"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        disabled
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
