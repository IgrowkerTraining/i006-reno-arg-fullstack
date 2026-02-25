import React, { useEffect } from "react";
import { CardObra } from "../components/common/CardObra";
import { useAuthApi } from "../hooks/useAuthApi";

const MisObras: React.FC = () => {
  const { getProjects } = useAuthApi();
  const [projects, setProjects] = React.useState<any[]>([]);

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      }
    };
    fetchObras();
  }, [getProjects]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects && projects.length > 0 ? (
        projects.map((obra) => (
          <div key={obra.id}>
            <CardObra
              codigo={obra.code}
              titulo={obra.name}
              ubicacion={obra.location}
              artStatus="ok"
              seguridadStatus="ok"
              progreso={45}
              responsable={obra.manager?.name || "Sin responsable asignado"}
              onDetalle={() => console.log("detalle", obra.id)}
            />
          </div>
        ))
      ) : (
        <p className="col-span-2 text-slate-500">No se encontraron obras vinculadas a tu cuenta.</p>
      )}
    </div>
  );
};

export default MisObras;

