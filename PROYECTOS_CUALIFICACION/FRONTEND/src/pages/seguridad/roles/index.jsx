// Roles.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from "@mui/icons-material/School";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { PageBreadcrumb } from "components";
import RolForm from "./RolesForm"; // componente separado

const rolesData = {
  admin: { codigo: "R001", nombre: "Administrador", icon: <AdminPanelSettingsIcon /> },
  docente: { codigo: "R002", nombre: "Docente", icon: <SchoolIcon /> },
  master: { codigo: "R003", nombre: "Master", icon: <SupervisorAccountIcon /> },
};

const Roles = () => {
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [formData, setFormData] = useState({ codigo: "", nombre: "" });

  const seleccionarRol = (rolKey) => {
    const datos = rolesData[rolKey];
    setRolSeleccionado(rolKey);
    setFormData({ codigo: datos.codigo, nombre: datos.nombre });
  };

  return (
    <Box component="main" sx={{ flexGrow: 1,  }}>
      <PageBreadcrumb title="Roles" subName="App" />
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          p: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Lista de roles */}
        <Box sx={{ flex: 1, borderRight: { md: "1px solid #ddd" }, pr: { md: 2 } }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>Roles disponibles</Typography>
          {Object.keys(rolesData).map((key) => (
            <Paper
              key={key}
              onClick={() => seleccionarRol(key)}
              elevation={rolSeleccionado === key ? 4 : 1}
              sx={{
                p: 2,
                mb: 2,
                border: rolSeleccionado === key ? "2px solid #1976d2" : "1px solid #ccc",
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: rolSeleccionado === key ? "#e3f2fd" : "#f9f9f9",
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 500,
              }}
            >
              {rolesData[key].icon} {rolesData[key].nombre}
            </Paper>
          ))}
        </Box>

        {/* Panel de edición */}
        <Box sx={{ flex: 2 }}>
          {rolSeleccionado ? (
            <RolForm rol={formData} reset={() => setRolSeleccionado(null)} />
          ) : (
            <Box
              sx={{
                height: "100%",
                minHeight:200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "gray",
                fontSize: "1.1rem",
              }}
            >
              Escoja un rol para editar sus permisos
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Roles;
