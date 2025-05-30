import { Avatar, Box, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import country3 from "@src/assets/images/flags/Bharat.png";
import avatar2 from "@src/assets/images/avatars/avatar2.png";
import { LuHeartHandshake, LuLock, LuLogOut, LuSettings, LuAlarmClock } from "react-icons/lu";
import { useDropdownMenu } from "../../hooks";
import { useLayoutContext } from "../../states";
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const selectedLanguage = country3;
  const { settings: { theme } } = useLayoutContext();
  const { anchorEl, open, handleClick, handleClose } = useDropdownMenu();
  const navigate = useNavigate(); // Hook para navegar entre rutas

  const usuario = JSON.parse(localStorage.getItem('Usuario'));

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('Usuario');
    navigate('/auth/logout'); // Redirige a la página de logout
  };

  // Función para abrir la página de la cuenta
  const handleOpenAccount = () => {
    navigate('/miCuenta');
  };

  const profileDropdownOptions = [
    {
      icon: LuAlarmClock,
      label: "Mi Cuenta",
      action: handleOpenAccount // Acción para abrir la cuenta
    },
    {
      icon: LuLogOut,
      label: "Cerrar Sesión",
      action: handleLogout // Acción para cerrar sesión
    }
  ];

  return (
    <Box sx={{
      cursor: "pointer",
      gap: 1,
      alignItems: "center",
      display: "flex",
      height: "100%",
      width: "auto"
    }}>
      <Box onClick={handleClick} sx={{
        paddingLeft: "8px",
        paddingRight: "8px",
        display: "flex",
        alignItems: "center",
        width: "180px",
        borderLeft: 1,
        borderRight: 1,
        borderColor: theme === "dark" ? "#374151" : "divider",
        height: "70px",
        backgroundColor: "rgba(230, 202, 202, 0.03)",
        justifyContent: "space-around"
      }}>
        <Avatar src={avatar2} alt="avatar" sx={{ height: 52, width: 52 }} />
        <div style={{ marginLeft: "12px" }}>
          <Typography variant="subtitle2" color={"text.primary"}>
            {`${usuario.nombre_usuario||''} ` || ''}
          </Typography>
          <Typography variant="caption" color={"text.primary"}>
          {`${usuario.rol_nombre||''} ` || ''}
          </Typography>
        </div>
      </Box>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0
            }
          }
        }
      }}>
        {profileDropdownOptions.map((option, idx) => {
          const Icon = option.icon;
          return (
            <MenuItem
              onClick={() => {
                handleClose();
                option.action(); // Ejecuta la acción específica de cada opción
              }}
              key={idx}
            >
              <ListItemIcon>
                <Icon size={18} />
              </ListItemIcon>
              <ListItemText sx={{ color: "text.secondary" }}>
                {option.label}
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default UserProfile;
