import { useState, useEffect } from "react";
import { Avatar, Badge, Box, Button, Divider, IconButton, Menu, MenuItem, MenuList, Typography } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { useDropdownMenu } from "../../hooks";
import { LuBell } from "react-icons/lu";
import { Fragment } from "react";
import SimpleBar from "simplebar-react";
import { useTranslation } from 'react-i18next';
// import { gsUrlApi } from "../../configuracion/ConfigServer";
import { useNavigate } from 'react-router-dom';
// import VistaEmail from '../../pages/notificaciones/emails/Inbox/vistaEmail';
const NotificationsDropdown = () => {}
// const NotificationsDropdown = () => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
  
//   const Usuario = JSON.parse(localStorage.getItem('Usuario'));
//   const [notifications, setNotifications] = useState([]);
//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const token = JSON.parse(localStorage.getItem('token'));
//   const accessToken = token;

//   // Fetch para obtener las notificaciones
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       // try {
//       //   const response = await fetch(gsUrlApi + `/notificaciones/listarLeidos/${Usuario._id}`);
//       //   const data = await response.json();

//       //   const sortedNotifications = (Array.isArray(data.datos) ? data.datos : []).sort((a, b) => {
//       //     return new Date(b.creadoEn) - new Date(a.creadoEn);
//       //   });

//       //   setNotifications(sortedNotifications);
//       // } catch (error) {
//       //   console.error("Error fetching notifications:", error);
//       //   setNotifications([]);
//       // }
//     };

//     fetchNotifications();
//   }, []);

//   const handleRedirect = () => {
//     handleClose();
//     navigate('/app/notificaciones/inbox');
//   };

//   function timeSince(date) {
//     if (typeof date !== "object") {
//       date = new Date(date);
//     }
//     const seconds = Math.floor((new Date().valueOf() - date.valueOf()) / 1000);
//     let intervalType;
//     let interval = Math.floor(seconds / 31536000);
//     if (interval >= 1) {
//       intervalType = "año";
//     } else {
//       interval = Math.floor(seconds / 2592000);
//       if (interval >= 1) {
//         intervalType = "month";
//       } else {
//         interval = Math.floor(seconds / 86400);
//         if (interval >= 1) {
//           intervalType = "dia";
//         } else {
//           interval = Math.floor(seconds / 3600);
//           if (interval >= 1) {
//             intervalType = "hora";
//           } else {
//             interval = Math.floor(seconds / 60);
//             if (interval >= 1) {
//               intervalType = "minuto";
//             } else {
//               interval = seconds;
//               intervalType = "segundo";
//             }
//           }
//         }
//       }
//     }
//     if (interval > 1 || interval === 0) {
//       intervalType += "s";
//     }
//     return " Hace" + " " + interval + " " + intervalType;
//   }

//   let previousDate = null; // Almacena la fecha del último encabezado mostrado
//   const { anchorEl, open, handleClick, handleClose } = useDropdownMenu();
//   const unreadCount = notifications.length; // Contador de notificaciones no leídas basado en el número de notificaciones

//   const StyledMenu = styled((props) => (
//     <Menu
//       elevation={0}
//       anchorOrigin={{
//         vertical: "bottom",
//         horizontal: "right",
//       }}
//       transformOrigin={{
//         vertical: "top",
//         horizontal: "right",
//       }}
//       {...props}
//     />
//   ))(({ theme }) => ({
//     "& .MuiPaper-root": {
//       borderRadius: 6,
//       marginTop: theme.spacing(1),
//       minWidth: 180,
//       color:
//         theme.palette.mode === "light"
//           ? "rgb(55, 65, 81)"
//           : theme.palette.grey[300],
//       boxShadow:
//         "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
//       "& .MuiMenu-list": {
//         padding: "4px 0",
//       },
//       "& .MuiMenuItem-root": {
//         "& .MuiSvgIcon-root": {
//           fontSize: 18,
//           color: theme.palette.text.secondary,
//           marginRight: theme.spacing(1.5),
//         },
//         "&:active": {
//           backgroundColor: alpha(
//             theme.palette.primary.main,
//             theme.palette.action.selectedOpacity
//           ),
//         },
//       },
//     },
//   }));

//   return (
//     <>
//       <IconButton onClick={handleClick} color={"inherit"}>
//         <Badge color="success" badgeContent={unreadCount}>
//           <LuBell size={24} />
//         </Badge>
//       </IconButton>
//       {selectedNotification ? (
//         <div></div>
//         // <VistaEmail selectedEmail={selectedNotification} goBack={() => setSelectedNotification(null)} />
//       ) : (
//         <StyledMenu
//           id="demo-customized-menu"
//           MenuListProps={{
//             "aria-labelledby": "demo-customized-button",
//           }}
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//         >
//           <MenuList
//             sx={{
//               py: 0,
//             }}
//           >
//             <Box
//               sx={{
//                 p: "12px",
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <Typography
//                   component={"h6"}
//                   sx={{
//                     color: "grey.700",
//                   }}
//                 >
//                   {t("Notificaciones")}
//                 </Typography>
//                 <Typography
//                   sx={{
//                     fontSize: "12px",
//                     color: "grey.700",
//                   }}
//                 >
//                   {t("Quitar todo")}
//                 </Typography>
//               </Box>
//             </Box>
//             <Divider />
//             <SimpleBar
//               style={{
//                 height: "320px",
//                 width: "340px",
//                 padding: "16px 0px",
//               }}
//             >
              
//               {notifications.map((notification, idx) => {
//                 const Icon = notification.icon;
//                 const notificationDate = new Date(notification.creadoEn); // Fecha de la notificación
//                 const currentDate = notificationDate.toDateString(); // Convertimos a cadena para comparar el día
//                 let labelName = "";

//                 // const handleNotificationClick = () => {

//                 //   handleClose();
//                 //   navigate(notification.link);

//                 //   const data = {
//                 //     _id: notification._id,
//                 //     mensaje: notification.mensaje ?? "",
//                 //     tipo: notification.tipo ?? "",
//                 //     leido: true,
//                 //     IdEmpresa: notification.IdEmpresa ?? "",
//                 //     destacado: notification.destacado ?? "",
//                 //     rol: notification.rol ?? "",
//                 //     creadoEn: notification.creadoEn ?? "",
//                 //     destinatario: notification.destinatario ?? "",
//                 //     asunto: notification.asunto ?? "",
//                 //     emisor: notification.emisor ?? "",
//                 //     idOrden: notification.idOrden ?? ""
//                 //   }

//                 //   // fetch(gsUrlApi + `/notificaciones/Actualizar`, {
//                 //   //   method: 'PUT',
//                 //   //   headers: {
//                 //   //     'Authorization': `Bearer ${accessToken}`,
//                 //   //     'Content-Type': 'application/json; charset=UTF-8',
//                 //   //     'Accept': 'application/json',
//                 //   //   },
//                 //   //   body: JSON.stringify({ data }),
//                 //   // })
//                 //   //   .then((res) => res.json())
//                 //   //   .then((notificacionData) => {
//                 //   //     // Maneja el resultado de la inserción de la notificación
//                 //   //     setNotifications((prevNotifications) =>
//                 //   //       prevNotifications.filter((notif) => notif._id !== notification._id)
//                 //   //     );
//                 //   //     navigate('/app/notificaciones/inbox', { state: data });
//                 //   //   })
//                 //   //   .catch(error => {
//                 //   //     console.error('Error al insertar notificación:', error);
//                 //   //     alert('Error al insertar notificación');
//                 //   //   });

//                 // };

//                 // Comparar el día de la notificación con el día anterior
//                 if (previousDate !== currentDate) {
//                   previousDate = currentDate;
//                   const today = new Date();
//                   const timeDifference = today.getTime() - notificationDate.getTime();
//                   const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

//                   labelName = dayDifference === 0 ? "Hoy" :
//                     dayDifference === 1 ? "Ayer" :
//                       notificationDate.toLocaleDateString();

//                   return (
//                     <Fragment key={idx}>
//                       <Typography
//                         component={"h5"}
//                         sx={{
//                           fontSize: "12px",
//                           color: "grey.700",
//                           px: "16px",
//                           mb: "8px",
//                           mt: "5px",
//                         }}
//                       >
//                         {labelName}
//                       </Typography>
//                       <MenuItem onClick={handleNotificationClick} sx={{ gap: 1 }}>
//                         <Box sx={{ display: "flex", alignItems: "center" }}>
//                           <Box sx={{ flexShrink: 0 }}>
//                             {notification.avatar ? (
//                               <Avatar
//                                 variant="circular"
//                                 sx={{ height: "36px", width: "36px" }}
//                                 src={notification.avatar}
//                               />
//                             ) : (
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   height: "36px",
//                                   width: "36px",
//                                   bgcolor: "primary.main",
//                                   borderRadius: "100%",
//                                 }}
//                               >
//                                 {Icon && <Icon color="white" />}
//                               </Box>
//                             )}
//                           </Box>
//                           <Box
//                             sx={{
//                               flexGrow: 1,
//                               overflow: "hidden",
//                               whiteSpace: "nowrap",
//                               ml: "8px",
//                             }}
//                           >
//                             <Typography
//                               component={"h5"}
//                               sx={{
//                                 mb: "4px",
//                                 fontWeight: 500,
//                                 color: "text.secondary",
//                               }}
//                             >
//                               {notification.asunto}

//                             </Typography>
//                             <Typography
//                               component={"small"}
//                               sx={{ ml: "4px", fontSize: "10px" }}
//                             >
//                               {timeSince(notification.creadoEn)}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </MenuItem>
//                     </Fragment>
//                   );
//                 } else {
//                   return <MenuItem onClick={handleNotificationClick} sx={{
//                     gap: 1
//                   }} key={idx}>
//                     <Box sx={{
//                       display: "flex",
//                       alignItems: "center"
//                     }}>
//                       <Box sx={{
//                         flexShrink: 0
//                       }}>
//                         {notification.avatar ? <Avatar variant="circular" sx={{
//                           height: "36px",
//                           width: "36px"
//                         }} src={notification.avatar} /> : <Box sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           height: "36px",
//                           width: "36px",
//                           bgcolor: "primary.main",
//                           borderRadius: "100%"
//                         }}>
//                           {Icon && <Icon color="white" />}
//                         </Box>}
//                       </Box>
//                       <Box sx={{
//                         flexGrow: 1,
//                         overflow: "hidden",
//                         whiteSpace: "nowrap",
//                         ml: "8px"
//                       }}>
//                         <Typography component={"h5"} sx={{
//                           mb: "4px",
//                           fontWeight: 500,
//                           color: "text.secondary"
//                         }}>

//                           {notification.asunto}
//                         </Typography>
//                         <Typography component={"small"} sx={{
//                           ml: "4px",
//                           fontSize: "10px"
//                         }}>
//                           {timeSince(notification.creadoEn)}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </MenuItem>;
//                 }
//               })}
//             </SimpleBar>
//             <Divider />
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 p: "12px",
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: "12px",
//                   color: "primary.main",
//                   cursor: "pointer",
//                 }}
//                 onClick={handleRedirect}
//               >
//                 {t("Ver todas")}
//               </Typography>
//             </Box>
//           </MenuList>
//         </StyledMenu>
//       )}
//     </>
//   );
// };

export default NotificationsDropdown;
