import {
  Box,
  Menu,
  TextField,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import { useState } from "react";

const FiltrosUsuarios = ({ anchorEl, handleClose, onAplicarFiltros }) => {
  const open = Boolean(anchorEl);
  const [rol, setRol] = useState("Todos");
  const [estado, setEstado] = useState("Todos"); // Puedes quitarlo si no lo estás usando

  const aplicarFiltros = () => {
    onAplicarFiltros({ rol, estado });
    handleClose();
  };

  const limpiarFiltros = () => {
    setRol("Todos");
    setEstado("Todos");
    onAplicarFiltros({ rol: "Todos", estado: "Todos" });
    handleClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: (theme) => ({
          overflow: "visible",
          mt: 1.5,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            left: "calc(50% - 6px)",
            width: 12,
            height: 12,
            backgroundColor: theme.palette.background.paper,
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        }),
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 200,
        }}
      >
        <TextField
          select
          label="Rol"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          size="small"
          fullWidth
        >
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Administrador">Administrador</MenuItem>
          <MenuItem value="Docente">Docente</MenuItem>
        </TextField>

        <Divider />

        <Button
          variant="contained"
          fullWidth
          sx={{ borderRadius: 2, textTransform: "none" }}
          onClick={aplicarFiltros}
        >
          Aplicar filtros
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ borderRadius: 2, textTransform: "none" }}
          onClick={limpiarFiltros}
        >
          Limpiar
        </Button>
      </Box>
    </Menu>
  );
};

export default FiltrosUsuarios;
