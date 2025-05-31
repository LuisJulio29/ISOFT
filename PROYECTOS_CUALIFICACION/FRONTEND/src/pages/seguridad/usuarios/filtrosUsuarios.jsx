import {
  Box,
  Menu,
  TextField,
  MenuItem,
  Button
} from "@mui/material";

const FiltrosUsuarios = ({ anchorEl, handleClose }) => {
  const open = Boolean(anchorEl);

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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

        <Button variant="contained" onClick={handleClose}>Aplicar</Button>
      </Box>
    </Menu>
  );
};

export default FiltrosUsuarios;
