import React from "react";
import PlaceholderActionLink from "../components/common/PlaceholderActionLink";
import PlaceholderScreen from "../components/common/PlaceholderScreen";
import { ROUTES } from "../constants/routes";

const NotFound: React.FC = () => {
  return (
    <PlaceholderScreen title="404 - Pagina no encontrada" description="La ruta no existe.">
      <div className="flex gap-3">
        <PlaceholderActionLink to={ROUTES.HOME} label="Ir al inicio" />
        <PlaceholderActionLink
          to={ROUTES.DASHBOARD}
          label="Ir a dashboard"
          variant="secondary"
        />
      </div>
    </PlaceholderScreen>
  );
};

export default NotFound;

