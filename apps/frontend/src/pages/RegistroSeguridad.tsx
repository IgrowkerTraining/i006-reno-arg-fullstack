import React from "react";
import { useParams } from "react-router-dom";
import PlaceholderActionLink from "../components/common/PlaceholderActionLink";
import PlaceholderScreen from "../components/common/PlaceholderScreen";
import { ROUTE_BUILDERS } from "../constants/routes";

const RegistroSeguridad: React.FC = () => {
  const { obraId } = useParams<{ obraId: string }>();

  return (
    <PlaceholderScreen
      title="Registro diario - Paso 2: Seguridad y ART"
      description={`Obra: ${obraId ?? "-"}`}
    >
      {obraId ? (
        <div className="flex gap-3">
          <PlaceholderActionLink
            to={ROUTE_BUILDERS.obraRegistroFinalizar(obraId)}
            label="Siguiente: Finalizar"
          />
          <PlaceholderActionLink
            to={ROUTE_BUILDERS.obraRegistro(obraId)}
            label="Volver a Tareas"
            variant="secondary"
          />
        </div>
      ) : null}
    </PlaceholderScreen>
  );
};

export default RegistroSeguridad;

