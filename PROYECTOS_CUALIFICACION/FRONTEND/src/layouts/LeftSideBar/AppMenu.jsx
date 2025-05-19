import { Box, Collapse, Menu, Typography } from "@mui/material";
import { findAllParent, findMenuItem, getMenuItemFromURL } from "@src/helpers/menu";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import { useLayoutContext } from "@src/states";
import { getLeftbarTheme } from "@src/layouts/LeftSideBar/helpers";
const MenuItemWithChildren = ({
  item,
  activeMenuItems,
  toggleMenu,
  theme
}) => {
  const [open, setOpen] = useState(activeMenuItems.includes(item.key));
  const Icon = item.icon;
  useEffect(() => {
    setOpen(activeMenuItems.includes(item.key));
  }, [activeMenuItems, item]);
  const toggleMenuItem = () => {
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
    return false;
  };
  return <li>
      <Box sx={{
      cursor: "pointer",
      display: "flex",
      padding: "12px 16px",
      gap: "12px",
      alignItems: "center",
      color: open ? theme.item.active : theme.item.color,
      "&:hover": {
        color: open ? theme.item.active : theme.item.hover
      }
    }} onClick={toggleMenuItem}>
        {Icon && <Icon size={16} />}
        <Typography variant="subtitle1" sx={{
        lineHeight: 1
      }}>
          {item.label}
        </Typography>
        <div style={{
        marginInlineStart: "auto"
      }}>
          {!item.badge ? <LuChevronRight size={16} style={{
          display: "flex",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "0.15s all"
        }} /> : <Box sx={{
          bgcolor: "success.main",
          width: "16px",
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 1
        }}>
              <Typography variant={"body2"} fontWeight={500} lineHeight={1}>
                {item.badge.text}
              </Typography>
            </Box>}
        </div>
      </Box>
      <Collapse in={open}>
        <ul style={{
        listStyle: "none",
        paddingInlineStart: "28px"
      }}>
          {(item.children || []).map((child, idx) => {
          return <Fragment key={idx}>
                {child.children ? <MenuItemWithChildren item={child} theme={theme} activeMenuItems={activeMenuItems} toggleMenu={toggleMenu} /> : <MenuItem item={child} theme={theme} level={1} activeMenuItems={activeMenuItems} />}
              </Fragment>;
        })}
        </ul>
      </Collapse>
    </li>;
};
const MenuItem = ({
  item,
  theme,
  level,
  activeMenuItems
}) => {
  const [open, setOpen] = useState(activeMenuItems.includes(item.key));
  const Icon = item.icon;
  useEffect(() => {
    setOpen(activeMenuItems.includes(item.key));
  }, [activeMenuItems, item]);
  return <li style={{
    padding: level == 1 ? "8px 16px" : "12px 16px"
  }}>
      <Box sx={{
      color: open ? theme.item.active : theme.item.color,
      "&:hover": {
        color: open ? theme.item.active : theme.item.hover
      }
    }}>
        <Link to={item.url} target={item.target} data-menu-key={item.key} style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        textDecoration: "none",
        color: "inherit"
      }}>
          {Icon && <Icon />}
          <Typography variant="subtitle1" style={{
          lineHeight: 1
        }}>
            {item.label}
          </Typography>
          {item.badge && <Box sx={{
          bgcolor: "success.main",
          width: "16px",
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 1
        }}>
              <Typography variant={"body2"} fontWeight={500} lineHeight={1}>
                {item.badge.text}
              </Typography>
            </Box>}
        </Link>
      </Box>
    </li>;
};
const AppMenu =  ({ 

}) => {
  const [menuItems, setMenuItems] = useState([]); // Estado inicial vacío 
  const location = useLocation();
  const {
    settings
  } = useLayoutContext();
  const menuRef = useRef(null);
  const [activeMenuItems, setActiveMenuItems] = useState([]);
  const toggleMenu = (menuItem, show) => {
    if (show) {
      setActiveMenuItems([menuItem["key"], ...findAllParent(menuItems, menuItem)]);
    }
  };
  const theme = useMemo(() => getLeftbarTheme(settings.sidenav.theme), [settings.sidenav.theme]);
  const activeMenu = useCallback(() => {
    const trimmedURL = location?.pathname?.replaceAll("", "");
    const matchingMenuItem = getMenuItemFromURL(menuItems, trimmedURL);
    if (matchingMenuItem) {
      const activeMt = findMenuItem(menuItems, matchingMenuItem.key);
      if (activeMt) {
        setActiveMenuItems([activeMt["key"], ...findAllParent(menuItems, activeMt)]);
      }
      setTimeout(function () {
        const activatedItem = document.querySelector(`#right-menu a[href="${trimmedURL}"]`);
        if (activatedItem != null) {
          const simplebarContent = document.querySelector("#right-menu");
          const offset = activatedItem.offsetTop - 150;
          scrollTo(simplebarContent, 100, 600);
          if (simplebarContent && offset > 100) {
            scrollTo(simplebarContent, offset, 600);
          }
        }
      }, 200);

      // scrollTo (Left Side Bar Active Menu)
      const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      };
      const scrollTo = (element, to, duration) => {
        const start = element.scrollTop,
          change = to - start,
          increment = 20;
        let currentTime = 0;
        const animateScroll = function () {
          currentTime += increment;
          const val = easeInOutQuad(currentTime, start, change, duration);
          element.scrollTop = val;
          if (currentTime < duration) {
            setTimeout(animateScroll, increment);
          }
        };
        animateScroll();
      };
    }
  }, [location.pathname, menuItems]);

  // useEffect(() => {
  //   var objSesion = JSON.parse(localStorage.getItem('token'));
  //   let accessToken = objSesion;
  //   console.log(accessToken)

  //   fetch("http://localhost:8080/interfaces", {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`,
  //       'Content-Type': 'application/json; charset=UTF-8',
  //       'Accept': 'application/json',
  //     }
  //   })
  //   .then(res => res.json())
  //   .then(data => {
  //     if (data.interfaces.length > 0) {
  //       let lstData = data.interfaces.sort((a, b) => a.Orden - b.Orden);


  //       let lstMenus = lstData.filter(obj => obj.parent === "#").sort((a, b) => a.Orden - b.Orden);


  //       let array = [];

  //       // Agregar títulos solo una vez antes del bucle
  //       let title = lstData.filter(obj => obj.isTitle === true).sort((a, b) => a.Orden - b.Orden);
  //       if (title.length > 0) {
  //         let data = title.map(item => ({
  //           Orden: item.Orden,
  //           key: item.key,
  //           label: item.label,
  //           isTitle: item.isTitle,
  //         }));
  //         console.log("title", data);
  //         array.push(...data); // Agregar títulos al array
  //       }

  //       // Agregar menuitems solo una vez antes del bucle
  //       let menuitem = lstData.filter(obj => obj.Type == "item" && obj.parent === undefined).sort((a, b) => a.Orden - b.Orden);
  //       console.log("menuitem", menuitem);
  //       if (menuitem.length > 0) {
  //         let menuindivudual = menuitem.map(item => ({
  //           Orden: item.Orden,
  //           key: item.key,
  //           label: item.label,
  //           translate: item.label,
  //           type: item.Type,
  //           icon: item.icon,
  //           url: item.url,
  //           parentKey: item.parent
  //         }));
  //         console.log("menuindivudual", menuindivudual);
  //         array.push(...menuindivudual); // Agregar menuitems al array
  //       }

  //       lstMenus.forEach(menu => {
  //         let objDataMenu = {
  //           Orden: menu.Orden,
  //           key: menu.key,
  //           label: menu.label,
  //           isTitle: menu.isTitle,
  //           type: "collapse",
  //           icon: menu.icon,
  //           children: [],
  //         };

  //         let lstSubMenu = lstData.filter(obj => obj.parent === menu.key).sort((a, b) => a.Orden - b.Orden);

  //         if (lstSubMenu.length > 0) {
  //           objDataMenu.children = lstSubMenu.map(sub => ({
  //             Orden: sub.Orden,
  //             key: sub.key,
  //             label: sub.label,
  //             translate: sub.label,
  //             type: sub.Type,
  //             icon: sub.icon,
  //             url: sub.url,
  //             parentKey: sub.parent
  //           }));
  //         }

  //         array.push(objDataMenu); // Agregar el menú con sus submenús
  //       });

  //       array = array.sort((a, b) => a.Orden - b.Orden); // Ordenar todo el array al final

  //       console.log("objDataMenu", array);
  //       setMenuItems(array); // Actualiza el estado de menuItems
  //     }



  //   })
  //   .catch(err => console.log("err", err));
  // }, []);
useEffect(() => {
  const staticMenu = [
    // {
    //   key: 'caracterizacion',
    //   label: 'Caracterización de docentes',
    //   icon: null,
    //   url: '/CaracterizacionDocentes',
    //   type: 'item'
    // },
    // {
    //   key: 'formaciones',
    //   label: 'Gestión de formaciones',
    //   icon: null,
    //   url: '/gestionFormaciones',
    //   type: 'item'
    // },
    {
      key: 'misCualificaciones',
      label: 'Mis Cualificaciones',
      icon: null,
      url: '/misCualificaciones',
      type: 'item'
    },
    {
      key: 'micuenta',
      label: 'Mi cuenta',
      icon: null,
      url: '/micuenta',
      type: 'item'
    }
    // {
    //   key: 'seguridad',
    //   label: 'Seguridad',
    //   icon: null,
    //   type: 'collapse',
    //   children: [
    //     {
    //       key: 'usuarios',
    //       label: 'Usuarios',
    //       url: '/usuarios',
    //       type: 'item'
    //     },
    //     {
    //       key: 'roles',
    //       label: 'Roles y permisos',
    //       url: '/roles',
    //       type: 'item'
    //     }
    //   ]
    // }
  ];
  setMenuItems(staticMenu);
}, []);

  useEffect(() => {
    if (menuItems && menuItems.length > 0) activeMenu();
  }, [activeMenu, menuItems]);
  return <>
      <ul ref={menuRef} id="main-side-menu" style={{
      marginTop: 60,
      marginBottom: 24,
      padding: "0 8px",
      listStyle: "none", 
      color: theme.label.color,
    }}>
        {(menuItems || []).map((item, idx) => {
        return <Fragment key={idx}>
              {item.isTitle ? <li style={{
            padding: "12px 16px"
          }}>
                  <Typography fontWeight={500} variant={"subtitle2"} color={"#001930"}>
                    {item.label}
                  </Typography>
                </li> : <>
                  {item.children ? <MenuItemWithChildren item={item} theme={theme} toggleMenu={toggleMenu} activeMenuItems={activeMenuItems} /> : <MenuItem item={item} theme={theme} activeMenuItems={activeMenuItems} />}
                </>}
            </Fragment>;
      })}
      </ul>
    </>;
};
export default AppMenu;

// import { Box, Collapse, Menu, Typography } from "@mui/material";
// import { findAllParent, findMenuItem, getMenuItemFromURL } from "../../helpers/menu";
// import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { LuChevronRight } from "react-icons/lu";
// import { Link, useLocation } from "react-router-dom";
// import { useLayoutContext } from "../../states";
// import { getLeftbarTheme } from "../../layouts/LeftSideBar/helpers";
// // import { gsUrlApi } from "../../configuracion/ConfigServer";

// const MenuItemWithChildren = ({
//   item,
//   activeMenuItems,
//   toggleMenu,
//   theme
// }) => {
//   const [open, setOpen] = useState(activeMenuItems.includes(item.key));
//   const Icon = item.icon;
//   useEffect(() => {
//     setOpen(activeMenuItems.includes(item.key));
//   }, [activeMenuItems, item]);
//   const toggleMenuItem = () => {
//     const status = !open;
//     setOpen(status);
//     if (toggleMenu) toggleMenu(item, status);
//     return false;
//   };
//   return <li>
//     <Box sx={{
//       cursor: "pointer",
//       display: "flex",
//       padding: "12px 16px",
//       gap: "12px",
//       alignItems: "center",
//       color: open ? theme.item.active : theme.item.color,
//       "&:hover": {
//         color: open ? theme.item.active : theme.item.hover
//       }
//     }} onClick={toggleMenuItem}>
//       {Icon && <Icon size={16} />}
//       <Typography variant="subtitle1" sx={{
//         lineHeight: 1
//       }}>
//         {item.label}
//       </Typography>
//       <div style={{
//         marginInlineStart: "auto"
//       }}>
//         {!item.badge ? <LuChevronRight size={16} style={{
//           display: "flex",
//           transform: open ? "rotate(90deg)" : "rotate(0deg)",
//           transition: "0.15s all"
//         }} /> : <Box sx={{
//           bgcolor: "success.main",
//           width: "16px",
//           height: "16px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           borderRadius: 1
//         }}>
//           <Typography variant={"body2"} fontWeight={500} lineHeight={1}>
//             {item.badge.text}
//           </Typography>
//         </Box>}
//       </div>
//     </Box>
//     <Collapse in={open}>
//       <ul style={{
//         listStyle: "none",
//         paddingInlineStart: "28px"
//       }}>
//         {(item.children || []).map((child, idx) => {
//           return <Fragment key={idx}>
//             {child.children ? <MenuItemWithChildren item={child} theme={theme} activeMenuItems={activeMenuItems} toggleMenu={toggleMenu} /> : <MenuItem item={child} theme={theme} level={1} activeMenuItems={activeMenuItems} />}
//           </Fragment>;
//         })}
//       </ul>
//     </Collapse>
//   </li>;
// };
// const MenuItem = ({
//   item,
//   theme,
//   level,
//   activeMenuItems
// }) => {
//   const [open, setOpen] = useState(activeMenuItems.includes(item.key));
//   const Icon = item.icon;
//   useEffect(() => {
//     setOpen(activeMenuItems.includes(item.key));
//   }, [activeMenuItems, item]);
//   return <li style={{
//     padding: level == 1 ? "8px 16px" : "12px 16px"
//   }}>
//     <Box sx={{
//       color: open ? theme.item.active : theme.item.color,
//       "&:hover": {
//         color: open ? theme.item.active : theme.item.hover
//       }
//     }}>
//       <Link to={item.url} target={item.target} data-menu-key={item.key} style={{
//         display: "flex",
//         gap: "10px",
//         alignItems: "center",
//         textDecoration: "none",
//         color: "inherit"
//       }}>
//         {Icon && <Icon />}
//         <Typography variant="subtitle1" style={{
//           lineHeight: 1
//         }}>
//           {item.label}
//         </Typography>
//         {item.badge && <Box sx={{
//           bgcolor: "success.main",
//           width: "16px",
//           height: "16px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           borderRadius: 1
//         }}>
//           <Typography variant={"body2"} fontWeight={500} lineHeight={1}>
//             {item.badge.text}
//           </Typography>
//         </Box>}
//       </Link>
//     </Box>
//   </li>;
// };
// const AppMenu = ({

// }) => {
//   const [menuItems, setMenuItems] = useState([]); // Estado inicial vacío 
//   const location = useLocation();
//   const {
//     settings
//   } = useLayoutContext();
//   const menuRef = useRef(null);
//   const [activeMenuItems, setActiveMenuItems] = useState([]);
//   const toggleMenu = (menuItem, show) => {
//     if (show) {
//       setActiveMenuItems([menuItem["key"], ...findAllParent(menuItems, menuItem)]);
//     }
//   };
//   const theme = useMemo(() => getLeftbarTheme(settings.sidenav.theme), [settings.sidenav.theme]);
//   const activeMenu = useCallback(() => {
//     const trimmedURL = location?.pathname?.replaceAll("", "");
//     const matchingMenuItem = getMenuItemFromURL(menuItems, trimmedURL);
//     if (matchingMenuItem) {
//       const activeMt = findMenuItem(menuItems, matchingMenuItem.key);
//       if (activeMt) {
//         setActiveMenuItems([activeMt["key"], ...findAllParent(menuItems, activeMt)]);
//       }
//       setTimeout(function () {
//         const activatedItem = document.querySelector(`#right-menu a[href="${trimmedURL}"]`);
//         if (activatedItem != null) {
//           const simplebarContent = document.querySelector("#right-menu");
//           const offset = activatedItem.offsetTop - 150;
//           scrollTo(simplebarContent, 100, 600);
//           if (simplebarContent && offset > 100) {
//             scrollTo(simplebarContent, offset, 600);
//           }
//         }
//       }, 200);

//       // scrollTo (Left Side Bar Active Menu)
//       const easeInOutQuad = (t, b, c, d) => {
//         t /= d / 2;
//         if (t < 1) return c / 2 * t * t + b;
//         t--;
//         return -c / 2 * (t * (t - 2) - 1) + b;
//       };
//       const scrollTo = (element, to, duration) => {
//         const start = element.scrollTop,
//           change = to - start,
//           increment = 20;
//         let currentTime = 0;
//         const animateScroll = function () {
//           currentTime += increment;
//           const val = easeInOutQuad(currentTime, start, change, duration);
//           element.scrollTop = val;
//           if (currentTime < duration) {
//             setTimeout(animateScroll, increment);
//           }
//         };
//         animateScroll();
//       };
//     }
//   }, [location.pathname, menuItems]);

//   useEffect(() => {
//     var objSesion = JSON.parse(localStorage.getItem('token'));
//     let accessToken = objSesion;
//     setMenuItems([]); // Actualiza el estado de menuItems

//     // fetch(gsUrlApi +"/interfaces", {
//     //   method: 'GET',
//     //   headers: {
//     //     'Authorization': `Bearer ${accessToken}`,
//     //     'Content-Type': 'application/json; charset=UTF-8',
//     //     'Accept': 'application/json',
//     //   }
//     // })
//     //   .then(res => res.json())
//     //   .then(data => {

//     //     if (data.interfaces.length > 0) {
//     //       let lstData = data.interfaces.sort((a, b) => a.Orden - b.Orden);

//     //       // Obtener el objeto de sesión y los permisos
//     //       let ObjSesion = JSON.parse(localStorage.getItem('Usuario'));
//     //       let glstPermisos = ObjSesion.IdRol.Permisos;

//     //       // Filtrar lstData por permisos
//     //       let lstDataAux = [];
//     //       for (let j = 0; j < glstPermisos.length; j++) {
//     //         lstDataAux.push(...lstData.filter(obj => obj.key === glstPermisos[j]));
//     //       }
//     //       lstData = lstDataAux; // Actualizar lstData con los elementos filtrados
//     //       // console.log("bvbb", lstData);
//     //       let datos = []
//     //       datos = data.interfaces
//     //       let lstMenus = datos.filter(obj => obj.parent === "#").sort((a, b) => a.Orden - b.Orden);
//     //       let array = [];
    

//     //       // Agregar títulos solo una vez antes del bucle
//     //       let title = lstData.filter(obj => obj.isTitle === true).sort((a, b) => a.Orden - b.Orden);
          

//     //       if (title.length > 0) {
//     //         let data = title.map(item => ({
//     //           Orden: item.Orden,
//     //           key: item.key,
//     //           label: item.label,
//     //           isTitle: item.isTitle,
//     //         }));
//     //         // console.log("title", data);
//     //         array.push(...data); // Agregar títulos al array
//     //       }
//     //       // console.log("4lost", array);
//     //       // Agregar menuitems solo una vez antes del bucle
//     //       let menuitem = lstData.filter(obj => obj.Type == "item" && obj.parent === undefined).sort((a, b) => a.Orden - b.Orden);
//     //       if (menuitem.length > 0) {
//     //         let menuindivudual = menuitem.map(item => ({
//     //           Orden: item.Orden,
//     //           key: item.key,
//     //           label: item.label,
//     //           translate: item.label,
//     //           type: item.Type,
//     //           icon: item.icon,
//     //           url: item.url,
//     //           parentKey: item.parent
//     //         }));
//     //         // console.log("menuindivudual", menuindivudual);
//     //         array.push(...menuindivudual); // Agregar menuitems al array
//     //       }
//     //       lstMenus.forEach(menu => {
//     //         let objDataMenu = {
//     //           Orden: menu.Orden,
//     //           key: menu.key,
//     //           label: menu.label,
//     //           isTitle: menu.isTitle,
//     //           type: "collapse",
//     //           icon: menu.icon,
//     //           children: [],
//     //         };

//     //         let lstSubMenu = lstData.filter(obj => obj.parent === menu.key).sort((a, b) => a.Orden - b.Orden);
         
            
//     //         if (lstSubMenu.length > 0) {
//     //           objDataMenu.children = lstSubMenu.map(sub => ({
//     //             Orden: sub.Orden,
//     //             key: sub.key,
//     //             label: sub.label,
//     //             translate: sub.label,
//     //             type: sub.Type,
//     //             icon: sub.icon,
//     //             url: sub.url,
//     //             parentKey: sub.parent
//     //           }));
//     //         }

//     //         array.push(objDataMenu); // Agregar el menú con sus submenús
//     //       });

//     //       array = array.sort((a, b) => a.Orden - b.Orden); // Ordenar todo el array al final
//     //       // console.log("pppp", array);
//     //       // Filtrar solo los menús que tienen hijos
//     //       const filteredArray = array.filter(obj => obj.children && obj.children.length > 0);

//     //       // console.log("objDataMenu", filteredArray);
//     //       // console.log("objDataMenu", array);
//     //       setMenuItems(filteredArray); // Actualiza el estado de menuItems
//     //     }
//     //   })
//     //   .catch(error => {
//     //     console.error("Error al obtener las interfaces:", error);
//     //   });
//   }, []);


//   useEffect(() => {
//     if (menuItems && menuItems.length > 0) activeMenu();
//   }, [activeMenu, menuItems]);
//   return <>
//     <ul ref={menuRef} id="main-side-menu" style={{
//       marginTop: 0,
//       marginBottom: 24,
//       padding: "0 8px",
//       listStyle: "none"
//     }}>
//       {(menuItems || []).map((item, idx) => {
//         return <Fragment key={idx}>
//           {item.isTitle ? <li style={{
//             padding: "12px 16px"
//           }}>
//             <Typography fontWeight={500} variant={"subtitle2"} color={theme.label.color}>
//               {item.label}
//             </Typography>
//           </li> : <>
//             {item.children ? <MenuItemWithChildren item={item} theme={theme} toggleMenu={toggleMenu} activeMenuItems={activeMenuItems} /> : <MenuItem item={item} theme={theme} activeMenuItems={activeMenuItems} />}
//           </>}
//         </Fragment>;
//       })}
//     </ul>
//   </>;
// };
// export default AppMenu;

