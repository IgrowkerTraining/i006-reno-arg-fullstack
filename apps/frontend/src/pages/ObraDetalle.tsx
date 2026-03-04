import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceholderActionLink from "../components/common/PlaceholderActionLink";
import PlaceholderScreen from "../components/common/PlaceholderScreen";
import { ROUTE_BUILDERS } from "../constants/routes";
import { api } from "../services/api";
import { Card } from "../components/common/Card";
import { Hammer, MapPin } from "lucide-react";
import { Button } from "../components/common/Button";
import { log } from "console";
import { formatDate } from "../utils/formateDate";

const ObraDetalle: React.FC = () => {
  const { obraId } = useParams<string>();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!obraId) return;

    const loadProject = async () => {
      try {
        setLoading(true);
        const project = await api.getProjectById(obraId);
        setProject(project);
      } catch {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [obraId]);

  if (loading) {
    return <div className="flex items-center justify-center h-[650px]">
      <p className="text-xl font-medium text-primary">Cargando detalle de obra...</p>
    </div>
  }

  console.log(project);


  return (
    <>
      {project ? (
        <>
          <div className="flex justify-start mb-4">
            <Button variant="ghost" className="mt-4 text-md" onClick={() => window.history.back()}> ← Volver a Mis obras</Button>
          </div>
          <div className="flex flex-col overflow-hidden h-[650px]">
            <Card className="p-10 border border-gray-300 rounded-2xl shadow-md min-h-full overflow-y-auto">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-sm font-semibold bg-accent rounded-full px-4 py-2 w-fit">{project.code}</h3>
                <span>Inicio de obra: {formatDate(project.registrationDate)}</span>
              </div>
              <h1 className="text-3xl font-bold my-4">{project.name}</h1>
              <p className="mb-4 flex items-center text-sm"><MapPin className="inline mr-2 w-4 h-4" />{project.location} | <span className="ml-2">Superficie: {project.surfaceM2}m2</span></p>
              <p >Responsable técnico: {project.manager.name} <span>{project.manager.license}</span></p>
              <h2 className="text-xl font-semibold mb-4"><Hammer className="inline mr-2" />Registro de ejecución</h2>
              <hr className="mb-6" />
              <Card className=" p-4 rounded-lg border border-neutro-3">
                <h4 className="text-lg font-semibold mb-2">Responsable técnico</h4>
              </Card>
              <Card className=" p-4 rounded-lg border border-neutro-3 my-6">
                <h4 className="text-lg font-semibold mt-4">Etapas de obra</h4>
                {project.stages.map((stage, index) => (
                  <div key={index} className="p-4 rounded-lg border-b border-neutro-3 mb-2">
                    <div className="flex justify-between items-center">
                      <h5 className="text-md font-semibold">{stage.typeName}</h5>
                      <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">{stage.statusName}</span>
                    </div>
                    {stage.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="ml-4 mt-2">
                        <p className="text-sm">{task.typeName}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </Card>
            </Card>
          </div>
        </>) : (
        <p>Obra no encontrada </p>
      )
      }

    </>
  );
};

export default ObraDetalle;
