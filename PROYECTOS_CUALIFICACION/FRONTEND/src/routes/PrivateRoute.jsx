import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../states";
import useUserRoutes from "../hooks/useRoutes"; // Asegúrate de que esté bien importado

export const RouteWrapper = ({ component: RouteComponent }) => {
  return <RouteComponent />;
};

export const PrivateRouteWrapper = ({ component: RouteComponent }) => {
  const { isAuthenticated } = useAuthContext();
  const allowedRoutes = useUserRoutes();
  const location = useLocation();

  // Mientras carga el menú dinámico, no mostramos nada
  if (!allowedRoutes || allowedRoutes.length === 0) return null;

  const currentPath = location.pathname.toLowerCase();

  // Si no está autenticado, redirige a login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si la ruta no está permitida por el backend (interfaces), redirige a /404 o /403
  if (!allowedRoutes.includes(currentPath)) {
    return <Navigate to="/404" replace />;
  }

  return <RouteComponent />;
};
