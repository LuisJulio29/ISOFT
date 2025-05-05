import { useAuthContext } from "../states";
import React from "react";
import { Navigate } from "react-router-dom";

export const RouteWrapper = ({component: RouteComponent }) => {
  return <RouteComponent />;
};

export const PrivateRouteWrapper = ({ component: RouteComponent}) => {
  const {isAuthenticated} = useAuthContext();
  return isAuthenticated ? <RouteComponent /> : <Navigate to={`/auth/login`} replace />;
};