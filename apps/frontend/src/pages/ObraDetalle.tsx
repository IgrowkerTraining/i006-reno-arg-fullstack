import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { Card } from "../components/common/Card";
import { Flower, Hammer, MapPin } from "lucide-react";
import { Button } from "../components/common/Button";
import { formatDate } from "../utils/formateDate";

const ObraDetalle: React.FC = () => {
  const { obraId } = useParams<string>();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");


  const handleGenerateAnalysis = async () => {
  if (!obraId || !month || !year) return;

  try {
    const response = await api.generateAnalysis(
      obraId,
      Number(month),
      Number(year)
    );

    navigate(`/analisis/${obraId}`, {
      state: {
        analysis: response,
        month,
        year,
      },
    });
  } catch (error) {
    console.error("Error generando análisis", error);
  }
};


  useEffect(() => {
    if (!obraId) return;

    const loadProject = async () => {
      try {
        setLoading(true);
        /*  const project = await api.getProjectById(obraId); */
        const project = await api.getReportById(obraId);
        setProject(project);

      } catch {
        setProject(null);
      }
    };

    loadProject();

  }, [obraId]);

  if (loading) {
    return <div className="flex items-center justify-center h-[650px]">
      <p className="text-xl font-medium text-primary">Cargando detalle de obra...</p>
    </div>
  }


  return (
    <>
      {project ? (
        <>
          <div className="flex justify-start mb-4">
            <Button variant="ghost" className="mt-4 text-md" onClick={() => window.history.back()}> ← Volver a Mis obras</Button>
          </div>
          <div className="flex flex-col overflow-hidden h-[650px]">
            <Card className="p-10 border border-gray-300 rounded-2xl shadow-md min-h-full overflow-y-auto grid grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-sm font-semibold bg-accent rounded-full px-4 py-2 w-fit">{project.code}</h3>
                  <span>Inicio de obra: {formatDate(project.registrationDate)}</span>
                </div>
                <h1 className="text-3xl font-bold my-4">{project.name}</h1>
                <p className="mb-1 flex items-center text-sm"><MapPin className="inline mr-2 w-4 h-4" />{project.location} | <span className="ml-2">Superficie: {project.surfaceM2}m2</span></p>
                <p className="mb-4 text-sm">Responsable técnico: {project.manager.name} <span>{project.manager.license}</span></p>
                <hr className="mb-6 border-secondary" />
                <h2 className="text-xl font-semibold mb-4"><Hammer className="inline mr-2" />Registro de ejecución</h2>
                <Card className=" p-4 rounded-lg border border-neutro-3 my-6 bg-neutro-3/50">
                  <h4 className="text-md font-semibold mt-4">ETAPA ACTUAL</h4>
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
              </div>
              <div>

                <div>
                  <div className="flex gap-2 mb-4">

                    <input
                      type="number"
                      placeholder="Mes"
                      min="1"
                      max="12"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="border rounded px-3 py-2 w-24"
                    />

                    <input
                      type="number"
                      placeholder="Año"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="border rounded px-3 py-2 w-28"
                    />

                  </div>

                  <Button
                    variant="secondary"
                    className="w-1/2 mb-4"
                    onClick={handleGenerateAnalysis}
                  >
                    <Flower className="inline mr-2" />
                    GENERAR ANALISIS IA
                  </Button>
                </div>
                <h3>Oficios en obra</h3>
                <ul className="list-disc list-inside mt-2">

                </ul>
              </div>
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
