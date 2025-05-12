import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { PrivateRouteWrapper } from "./PrivateRoute";

const LoadComponent = ({ component: Component }) => (
  <Suspense fallback={null}>
    <Component />
  </Suspense>
);

// Layout principal (aunque no se usa directamente)
const VerticalLayout = lazy(() => import("../layouts/VerticalLayout"));

// Rutas privadas para módulos de la app
const uiComponentRoutes = [
  // {
  //   path: "/app/seguridad/roles",
  //   element: <PrivateRouteWrapper component={lazy(() => import("../pages/seguridad/roles/roles.jsx"))} />
  // },
  // {
  //   path: "/app/seguridad/usuarios",
  //   element: <PrivateRouteWrapper component={lazy(() => import("../pages/seguridad/usuarios/usuarios.jsx"))} />
  // },
  // {
  //   path: "/app/informes/hdv",
  //   element: <PrivateRouteWrapper component={lazy(() => import("../pages/informes/hdv"))} />
  // },
  // {
  //   path: "/app/configuracion/inventarios",
  //   element: <PrivateRouteWrapper component={lazy(() => import("../pages/configuracion/inventarios/inventarios.jsx"))} />
  // },
  // {
  //   path: "/app/ordenes",
  //   element: <PrivateRouteWrapper component={lazy(() => import("../pages/ordenes/ordenesList.jsx"))} />
  // },
  // {
  //   path: "/app/tablero",
  //   element: <PrivateRouteWrapper component={lazy(() => import("../pages/tablero/tablero.jsx"))} />
  // },
  // {
  //   path: "/app/configuracion/clientes",
  //   element: <PrivateRouteWrapper component={lazy(() => import("../pages/configuracion/clientes/clientes.jsx"))} />
  // },
  // {
  //   path: "/app/configuracion/servicios",
  //   element: <PrivateRouteWrapper component={lazy(() => import("../pages/configuracion/servicios/servicios.jsx"))} />
  // },
  // {
  //   path: "/app/dashboard/procesos",
  //   element: <LoadComponent component={lazy(() => import("../pages/dashboard/Kanban/index.jsx"))} />
  // },
  // {
  //   path: "/app/notificaciones/inbox",
  //   element: <LoadComponent component={lazy(() => import("../pages/notificaciones/emails/Inbox"))} />
  // }
];

// Rutas de error y fallback
const otherRotes = [
  {
    path: "/error-404",
    element: <LoadComponent component={lazy(() => import("../pages/error/Error404"))} />
  },
  {
    path: "/error-500",
    element: <LoadComponent component={lazy(() => import("../pages/error/Error500"))} />
  },
  {
    path: "*",
    element: <LoadComponent component={lazy(() => import("../pages/error/Error404"))} />
  }
];

// Rutas de autenticación
const authRoutes = [
  {
    path: "/auth/login",
    element: <LoadComponent component={lazy(() => import("../pages/auth/Login"))} />
  },
  {
    path: "/auth/register",
    element: <LoadComponent component={lazy(() => import("../pages/auth/Register"))} />
  },
  {
    path: "/auth/logout",
    element: <LoadComponent component={lazy(() => import("../pages/auth/Logout"))} />
  },
  {
    path: "/auth/recover-password",
    element: <LoadComponent component={lazy(() => import("../pages/auth/ResetPassword"))} />
  },
  {
    path: "/auth/lock-screen",
    element: <LoadComponent component={lazy(() => import("../pages/auth/LockScreen"))} />
  },
  {
    path: "/auth/confirm-mail",
    element: <LoadComponent component={lazy(() => import("../pages/auth/ConfirmMail"))} />
  },
  {
    path: "/auth/login2",
    element: <LoadComponent component={lazy(() => import("../pages/auth/Login2"))} />
  },
  {
    path: "/auth/register2",
    element: <LoadComponent component={lazy(() => import("../pages/auth/Register2"))} />
  },
  {
    path: "/auth/logout2",
    element: <LoadComponent component={lazy(() => import("../pages/auth/Logout2"))} />
  },
  {
    path: "/auth/recover-password2",
    element: <LoadComponent component={lazy(() => import("../pages/auth/ResetPassword2"))} />
  },
  {
    path: "/auth/lock-screen2",
    element: <LoadComponent component={lazy(() => import("../pages/auth/LockScreen"))} />
  },
  {
    path: "/auth/confirm-mail2",
    element: <LoadComponent component={lazy(() => import("../pages/auth/ConfirmMail"))} />
  }
];

// Rutas administrativas
const adminRoutes = [
  {
    path: "error-404-alt",
    element: <LoadComponent component={lazy(() => import("../pages/error/Error404Alt"))} />
  },
  {
    path: "/inicio",
    element: <PrivateRouteWrapper component={lazy(() => import("../pages/inicio"))} />
  },
  {
    path: "/miCuenta",
    element: <LoadComponent component={lazy(() => import("@src/pages/miCuenta"))} />
  },
  {
    path: "/CaracterizacionDocentes",
    element: <LoadComponent component={lazy(() => import("@src/pages/CaraterizacionDocentes"))} />
  },
  {
    path: "/DocentesForm",
    element: <LoadComponent component={lazy(() => import("@src/pages/CaraterizacionDocentes/DocentesForm"))} />
  },
  {
    path: "/GestionFormaciones",
    element: <LoadComponent component={lazy(() => import("@src/pages/gestionFormaciones"))} />
  },
  {
    path: "/FormacionesForm",
    element: <LoadComponent component={lazy(() => import("@src/pages/gestionFormaciones/FormacionesForm"))} />
  },
  {
    path: "/Usuarios",
    element: <LoadComponent component={lazy(() => import("@src/pages/seguridad/usuarios"))} />
  },
  {
    path: "/Roles",
    element: <LoadComponent component={lazy(() => import("@src/pages/seguridad/roles"))} />
  },
  {
    path: "/misCualificaciones",
    element: <LoadComponent component={lazy(() => import("@src/pages/misCualificaciones"))} />
  },
];

// Rutas agrupadas por layout
export const defaultLayoutRoutes = [...otherRotes, ...authRoutes];

export const verticalLayoutRoutes = [
  {
    path: "/",
    element: <Navigate to="/auth/login" />
  },
  ...adminRoutes,
  ...uiComponentRoutes
];
