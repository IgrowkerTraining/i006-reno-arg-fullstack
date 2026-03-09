import React, { useEffect, useState } from "react";
import { CardObra } from "../components/common/CardObra";
import { useAuthApi } from "../hooks/useAuthApi";
import { Search } from "../components/common/Search";
import { Button } from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ROUTE_BUILDERS, ROUTES } from "../constants/routes";
import { useDebounce } from "../hooks/useDebounced";

const MisObras: React.FC = () => {
  const { user } = useAuth();
  const { getProjects } = useAuthApi();
  const [projects, setProjects] = React.useState<any[]>([]);
  const [ isLoading, setIsLoading ] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 300)

  const navigate = useNavigate();
  const nuevaObraPath = `${ROUTES.DASHBOARD}/${ROUTES.MIS_OBRAS_NUEVA}`;

  useEffect(() => {
    const fetchObras = async () => {
      try {
        setIsLoading(true)
        const data = await getProjects();
        setProjects(data);

        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      }
    };
    fetchObras();
  }, [getProjects]);

  const filteredProjects = projects.filter((project) => {
    const searchMatch = Object.values(project).some((value) =>
      String(value).toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    return searchMatch
  })


  if (isLoading) {
    return <div className="flex items-center justify-center h-[650px]">
      <p className="text-xl font-medium text-primary">Cargando datos...</p>
    </div>
  }


  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:gap-14 md:grid-cols-2 lg:grid-cols-4">
        <Search
          placeholder="Buscar obra..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 lg:col-span-3" />
        {user?.idRol === 1 && <Button variant="secondary" onClick={() => navigate(nuevaObraPath)} className="mb-4 lg:col-span-1">+ Nueva obra</Button>}
      </div>
      <h1 className="text-2xl font-bold mt-5">Mis Obras</h1>
      <section className="flex gap-4 overflow-x-auto py-4">
        {filteredProjects && filteredProjects.length > 0 ? (
          filteredProjects.map((obra) => (

            <CardObra
              key={obra.id}
              codigo={obra.code}
              titulo={obra.name}
              ubicacion={obra.location}
              fechaInicio={obra.registrationDate}
              artStatus="ok"
              seguridadStatus="ok"
              progreso={45}
              responsable={obra.manager?.name || "Sin responsable asignado"}
              matricula={obra.manager?.license || "Sin matrícula"}
              onDetalle={() => navigate(ROUTE_BUILDERS.obraDetalle(String(obra.id)))}
              onRegistro={() => navigate(ROUTE_BUILDERS.obraRegistro(String(obra.id)))}
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
