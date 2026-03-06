import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceholderActionLink from "../components/common/PlaceholderActionLink";
import PlaceholderScreen from "../components/common/PlaceholderScreen";
import { ROUTE_BUILDERS } from "../constants/routes";
import { api } from "../services/api";
import { Card } from "../components/common/Card";
import { MapPin } from "lucide-react";
import { Button } from "../components/common/Button";

const ObraDetalle: React.FC = () => {
  const { obraId } = useParams<string>();
  const [project, setProject] = useState(null);


  useEffect(() => {
    if (!obraId) return;

    const loadProject = async () => {
      try {
        const project = await api.getProjectById(obraId);
        setProject(project);

      } catch {
        setProject(null);
      }
    };

    loadProject();

  }, [obraId]);

  console.log({ project });
  return (
    <>
      {project ? (
        <>
          <div className="flex flex-col overflow-hidden h-[650px]">
            <Card className="p-10 border border-gray-300 rounded-2xl shadow-md min-h-full overflow-y-auto">
              <h2>Detalle de obra ID # {obraId}</h2>
              <hr className="my-2 border-secondary" />
              <h3 className="text-xl font-semibold">{project.code}</h3>
              <h1 className="text-3xl font-bold my-4">{project.name}</h1>
              <p className="mb-4 flex items-center"><MapPin className="inline mr-2" />{project.location}</p>
              <p className="mb-4 flex items-center">Superficie: {project.surfaceM2}m2</p>
              <Card className=" p-4 rounded-lg border border-neutro-3">
                <h4 className="text-lg font-semibold mb-2">Responsable técnico</h4>
                <p className="">{project.manager.name}</p>
                <p className="">{project.manager.license}</p>
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
          <div className="flex justify-end mt-4">
            <Button variant="outline" className="mt-4 text-sm" onClick={() => window.history.back()}> ← Volver a Mis obras</Button>
          </div>
        </>) : (
        <p>Obra no encontrada </p>
      )
      }

    </>
  );
};

export default ObraDetalle;
