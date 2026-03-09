import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import MisObras from "../pages/MisObras";
import NuevaObra from "../pages/NuevaObra";
import ObraDetalle from "../pages/ObraDetalle";
import RegistroTareas from "../pages/RegistroTareas";
import RegistroSeguridad from "../pages/RegistroSeguridad";
import RegistroFinalizar from "../pages/RegistroFinalizar";
import ReporteIA from "../pages/ReporteIA";
import ReporteIAObra from "../pages/ReporteIAObra";
import NotFound from "../pages/NotFound";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import Home from "../components/home/Home";
import ReporteIAObraHistorial from "../pages/ReporteIAObraHistorial";

const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Navigate
      to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
      replace
    />
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path={ROUTES.MIS_OBRAS} element={<MisObras />} />
        <Route path={ROUTES.MIS_OBRAS_NUEVA} element={<NuevaObra />} />
        <Route path={ROUTES.OBRA_DETALLE} element={<ObraDetalle />} />
        <Route path={ROUTES.OBRA_REGISTRO} element={<RegistroTareas />} />
        <Route path={ROUTES.OBRA_REGISTRO_SEGURIDAD} element={<RegistroSeguridad />} />
        <Route path={ROUTES.OBRA_REGISTRO_FINALIZAR} element={<RegistroFinalizar />} />
        <Route path={ROUTES.REPORTE_IA} element={<ReporteIA />} />
        <Route path={ROUTES.REPORTE_IA_OBRA} element={<ReporteIAObra />} />
        <Route path={ROUTES.REPORTE_IA_OBRA_HISTORIAL} element={<ReporteIAObraHistorial />} />
      </Route>

      <Route path={ROUTES.HOME} element={<RootRedirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
