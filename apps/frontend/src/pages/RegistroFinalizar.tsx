import React from "react";
import { useParams } from "react-router-dom";
import PlaceholderActionLink from "../components/common/PlaceholderActionLink";
import PlaceholderScreen from "../components/common/PlaceholderScreen";
import { ROUTES, ROUTE_BUILDERS } from "../constants/routes";

const RegistroFinalizar: React.FC = () => {
  const { obraId } = useParams<{ obraId: string }>();

  return (
    <PlaceholderScreen
      title="Registro diario - Paso 3: Finalizar"
      description={`Obra: ${obraId ?? "-"}`}
    >
      {obraId ? (
        <div className="flex gap-3">
          <PlaceholderActionLink
            to={ROUTE_BUILDERS.obraDetalle(obraId)}
            label="Volver al detalle"
          />
          <PlaceholderActionLink
            to={ROUTES.MIS_OBRAS}
            label="Ir a Mis obras"
            variant="secondary"
          />
        </div>
      ) : null}
    </PlaceholderScreen>
  );
};

export default RegistroFinalizar;

