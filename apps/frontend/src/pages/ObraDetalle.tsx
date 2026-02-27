import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceholderActionLink from "../components/common/PlaceholderActionLink";
import PlaceholderScreen from "../components/common/PlaceholderScreen";
import { ROUTE_BUILDERS } from "../constants/routes";
import { api } from "../services/api";

const ObraDetalle: React.FC = () => {
  const { obraId } = useParams<{ obraId: string }>();
  const [projectName, setProjectName] = useState<string | null>(null);
  const [projectLocation, setProjectLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!obraId) return;

    const loadProject = async () => {
      try {
        const project = await api.getProjectById(obraId);
        setProjectName(project?.name ?? null);
        setProjectLocation(project?.location ?? null);
      } catch {
        setProjectName(null);
        setProjectLocation(null);
      }
    };

    loadProject();
  }, [obraId]);

  return (
    <PlaceholderScreen
      title="Detalle de obra"
      description={
        projectName
          ? `${projectName}${projectLocation ? ` · ${projectLocation}` : ""}`
          : `Obra: ${obraId ?? "-"}`
      }
    >
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
