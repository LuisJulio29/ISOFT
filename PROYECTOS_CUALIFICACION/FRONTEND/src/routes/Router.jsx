import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import ScrollToTop from "@src/components/ScrollToTop";
import DefaultLayout from "../layouts/DefaultLayout";
import VerticalLayout from "../layouts/VerticalLayout";

import {
  publicRoutesList,
  allPrivateRoutes,
  errorRoutesList,
} from "./routes";
import useUserRoutes from "../hooks/useRoutes";

const Router = () => {
  const token = localStorage.getItem("token");
  const { allowedRoutes, loading } = useUserRoutes(token);

  // ⏳ Esperamos que las rutas estén listas
  if (loading) {
    return <>Cargando rutas...</>;
  }

  return (
    <BrowserRouter key={token}>
      <ScrollToTop />
      <Routes>
        {publicRoutesList.map((route, idx) => (
          <Route
            key={`public-${idx}`}
            path={route.path}
            element={
              <DefaultLayout>
                <Suspense fallback={<>Cargando...</>}>
                  <route.element />
                </Suspense>
              </DefaultLayout>
            }
          />
        ))}

        {allowedRoutes.length > 0 &&
          allPrivateRoutes
            .filter((route) =>
              allowedRoutes.includes(route.path.toLowerCase())
            )
            .map((route, idx) => (
              <Route
                key={`private-${idx}`}
                path={route.path}
                element={
                  <VerticalLayout>
                    <Suspense fallback={<>Cargando...</>}>
                      <route.element />
                    </Suspense>
                  </VerticalLayout>
                }
              />
            ))}

        {errorRoutesList.map((route, idx) => (
          <Route
            key={`error-${idx}`}
            path={route.path}
            element={
              <DefaultLayout>
                <Suspense fallback={<>Cargando...</>}>
                  <route.element />
                </Suspense>
              </DefaultLayout>
            }
          />
        ))}

        <Route path="/" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
