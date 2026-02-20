import React from "react";
import { useParams } from "react-router-dom";
import PlaceholderActionLink from "../components/common/PlaceholderActionLink";
import PlaceholderScreen from "../components/common/PlaceholderScreen";
import { ROUTE_BUILDERS } from "../constants/routes";

const RegistroTareas: React.FC = () => {
  const { obraId } = useParams<{ obraId: string }>();

  return (
    <PlaceholderScreen
      title="Registro diario - Paso 1: Tareas"
      description={`Obra: ${obraId ?? "-"}`}
    >
      {obraId ? (
        <div className="flex gap-3">
          <PlaceholderActionLink
            to={ROUTE_BUILDERS.obraRegistroSeguridad(obraId)}
            label="Siguiente: Seguridad y ART"
          />
          <PlaceholderActionLink
            to={ROUTE_BUILDERS.obraDetalle(obraId)}
            label="Volver"
            variant="secondary"
          />
        </div>
      ) : null}
    </PlaceholderScreen>
  );
};

export default RegistroTareas;

