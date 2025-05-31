import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const LoadComponent = ({ component: Component }) => (
  <Suspense fallback={null}>
    <Component />
  </Suspense>
);

const PrivateRouteWrapper = ({ component: Component }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? <Component /> : <Navigate to="/auth/login" replace />;
};

// RUTAS PÚBLICAS (AUTH)
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
    path: "/auth/recover-password2",
    element: <LoadComponent component={lazy(() => import("../pages/auth/ResetPassword"))} />
  },
  {
    path: "/auth/confirm-mail2",
    element: <LoadComponent component={lazy(() => import("../pages/auth/ConfirmMail"))} />
  },
  {
    path: "/auth/lock-screen",
    element: <LoadComponent component={lazy(() => import("../pages/auth/LockScreen"))} />
  }
];

// RUTAS DE ERROR Y FALLBACK
const errorRoutes = [
  {
    path: "/error-404",
    element: <LoadComponent component={lazy(() => import("../pages/error/Error404"))} />
  },
  {
    path: "/error-500",
    element: <LoadComponent component={lazy(() => import("../pages/error/Error500"))} />
  },
  {
    path: "/error-404-alt",
    element: <LoadComponent component={lazy(() => import("../pages/error/Error404Alt"))} />
  },
  {
    path: "*",
    element: <LoadComponent component={lazy(() => import("../pages/error/Error404"))} />
  }
];

// RUTAS PRIVADAS (ADMIN)
const adminRoutes = [
  {
    path: "/inicio",
    element: <PrivateRouteWrapper component={lazy(() => import("../pages/inicio"))} />
  },
  {
    path: "/miCuenta",
    element: <PrivateRouteWrapper component={lazy(() => import("../pages/miCuenta"))} />
  },
  {
    path: "/CaracterizacionDocentes",
    element: <PrivateRouteWrapper component={lazy(() => import("../pages/CaraterizacionDocentes"))} />
  },
  {
    path: "/DocentesForm",
    element: <PrivateRouteWrapper component={lazy(() => import("../pages/CaraterizacionDocentes/DocentesForm"))} />
  },
  {
    path: "/GestionFormaciones",
    element: <PrivateRouteWrapper component={lazy(() => import("../pages/gestionFormaciones"))} />
  },
  {
    path: "/FormacionesForm",
    element: <PrivateRouteWrapper component={lazy(() => import("../pages/gestionFormaciones/FormacionesForm"))} />
  },
  {
    path: "/Usuarios",
    element: <PrivateRouteWrapper component={lazy(() => import("../pages/seguridad/usuarios"))} />
  },
  {
    path: "/Roles",
    element: <PrivateRouteWrapper component={lazy(() => import("../pages/seguridad/roles"))} />
  },
  {
    path: "/misCualificaciones",
    element: <PrivateRouteWrapper component={lazy(() => import("../pages/misCualificaciones"))} />
  }
];


const uiComponentRoutes = [

];

export const defaultLayoutRoutes = [
  ...authRoutes,
  ...errorRoutes
];

export const verticalLayoutRoutes = [
  {
    path: "/",
    element: <Navigate to="/auth/login" />
  },
  ...adminRoutes,
  ...uiComponentRoutes
];
