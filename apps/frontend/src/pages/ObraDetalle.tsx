import React from "react";
import { useParams } from "react-router-dom";
import PlaceholderActionLink from "../components/common/PlaceholderActionLink";
import PlaceholderScreen from "../components/common/PlaceholderScreen";
import { ROUTE_BUILDERS } from "../constants/routes";

const ObraDetalle: React.FC = () => {
  const { obraId } = useParams<{ obraId: string }>();

  return (
    <PlaceholderScreen title="Detalle de obra" description={`Obra: ${obraId ?? "-"}`}>
      {obraId ? (
        <div className="flex gap-3">
          <PlaceholderActionLink
            to={ROUTE_BUILDERS.obraRegistro(obraId)}
            label="Registro diario"
          />
          <PlaceholderActionLink
            to={"/dashboard/mis-obras"}
            label="Volver a Mis obras"
            variant="secondary"
          />
        </div>
      ) : null}
    </PlaceholderScreen>
  );
};

export default ObraDetalle;

