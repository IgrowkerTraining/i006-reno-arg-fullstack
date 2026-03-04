import React, { useEffect, useState } from "react";
import { CardObra } from "../components/common/CardObra";
import { useAuthApi } from "../hooks/useAuthApi";
import { Search } from "../components/common/Search";
import { Button } from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const MisObras: React.FC = () => {
  const { user } = useAuth();
  const { getProjects } = useAuthApi();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchObras = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchObras();
  }, [getProjects]);

   if (loading) {
    return <div className="flex items-center justify-center h-[650px]">
      <p className="text-xl font-medium text-primary">Cargando obras...</p>
    </div>
  }
  

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:gap-14 md:grid-cols-2 lg:grid-cols-4">
        <Search placeholder="Buscar obra..." className="mb-4 lg:col-span-3" />
        {user?.idRol === 1 && <Button variant="secondary" onClick={() => navigate("/dashboard/mis-obras/nueva")} className="mb-4 lg:col-span-1">+ Nueva obra</Button>}
      </div>
      <h1 className="text-2xl font-bold mt-5">Mis Obras</h1>
      <section className="flex gap-4 overflow-x-auto py-4">
        {projects && projects.length > 0 ? (
          projects.map((obra) => (

            <CardObra
              key={obra.id}
              codigo={obra.code}
              titulo={obra.name}
              ubicacion={obra.location}
              fechaInicio={obra.registrationDate}
              artStatus={obra.config?.artCoverageId ? "ok" : "warning"}
               seguridadStatus={"ok"}
              //seguridadStatus={obra.config?.safetyCoverageId ? "ok" : "warning"}
              progreso={45}
              responsable={obra.manager?.name || "Sin responsable asignado"}
              matricula={obra.manager?.license || "Sin matrícula"}
              onDetalle={() => navigate(`/dashboard/mis-obras/${obra.id}`)}
              onRegistro={() => navigate(`/dashboard/mis-obras/${obra.id}/registro`)}
              user={user}
            />

          ))
        ) : (
          <p className="col-span-2 text-slate-500">No se encontraron obras vinculadas a tu cuenta.</p>
        )}
      </section>
    </>
  );
};

export default MisObras;

