<<<<<<< Updated upstream
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

=======
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Flower, Hammer, MapPin } from "lucide-react";
import { api, ProjectFullDetailResponse } from "../services/api";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { formatDate } from "../utils/formateDate";
import { ROUTE_BUILDERS, ROUTES } from "../constants/routes";

const ObraDetalle: React.FC = () => {
  const { obraId } = useParams<string>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectFullDetailResponse | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const selectedMonth = useMemo(() => Number(month), [month]);
  const selectedYear = useMemo(() => Number(year), [year]);

  const canGenerateIA =
    Boolean(obraId) &&
    Number.isInteger(selectedMonth) &&
    selectedMonth >= 1 &&
    selectedMonth <= 12 &&
    Number.isInteger(selectedYear) &&
    selectedYear >= 2000;
>>>>>>> Stashed changes

  useEffect(() => {
    if (!obraId) return;

    const loadProject = async () => {
      try {
<<<<<<< Updated upstream
        const project = await api.getProjectById(obraId);
        setProject(project);
=======
        setLoading(true);
        setError(null);
>>>>>>> Stashed changes

        const [projectDetail, projectReports] = await Promise.all([
          api.getProjectFullDetail(obraId),
          api.getReportsByProject(obraId),
        ]);

        setProject(projectDetail);
        setReports(projectReports);
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "No se pudo cargar el detalle de la obra.";
        setError(message);
        setProject(null);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    void loadProject();
  }, [obraId]);

<<<<<<< Updated upstream
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
=======
  const handleGenerateAnalysis = async () => {
    if (!obraId || !canGenerateIA) return;

    try {
      setAnalysisLoading(true);
      const generated = await api.generateAnalysis(obraId, selectedMonth, selectedYear);

      navigate(`${ROUTES.DASHBOARD}/${ROUTES.REPORTE_IA}`, {
        state: {
          projectId: obraId,
          month: selectedMonth,
          year: selectedYear,
          generatedAnalysis: generated,
        },
      });
    } catch (analysisError) {
      const message =
        analysisError instanceof Error
          ? analysisError.message
          : "No se pudo generar el análisis IA.";
      setError(message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleReportDetail = (reportId: string | number) => {
    if (!obraId) return;
    navigate(ROUTE_BUILDERS.obraRegistroDetalle(obraId, String(reportId)));
  };

  if (loading) {
    return (
      <div className="flex h-[650px] items-center justify-center">
        <p className="text-xl font-medium text-primary">Cargando detalle de obra...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-[650px] items-center justify-center">
        <p className="text-lg text-neutro-1">{error || "No se encontró la obra seleccionada."}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-start">
        <Button variant="ghost" className="mt-4 text-md" onClick={() => window.history.back()}>
          ← Volver a Mis obras
        </Button>
      </div>

      <div className="flex h-[650px] flex-col overflow-hidden">
        <Card className="grid min-h-full grid-cols-2 gap-8 overflow-y-auto rounded-2xl border border-gray-300 p-10 shadow-md">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <h3 className="w-fit rounded-full bg-accent px-4 py-2 text-sm font-semibold">
                {project.codigo}
              </h3>
              <span>Inicio de obra: {project.fecha_registro}</span>
            </div>

            <h1 className="my-4 text-3xl font-bold">{project.nombre}</h1>

            <p className="mb-1 flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4" />
              {project.ubicacion} | <span className="ml-2">Superficie: {project.superficie_m2}m2</span>
            </p>

            <p className="mb-4 text-sm">
              Responsable técnico: {project.responsable_nombre}{" "}
              <span>{project.responsable_matricula || "-"}</span>
            </p>

            <hr className="mb-6 border-secondary" />

            <h2 className="mb-4 text-xl font-semibold">
              <Hammer className="mr-2 inline" />
              Registro de ejecución
            </h2>

            <Card className="my-6 rounded-lg border border-neutro-3 bg-neutro-3/50 p-4">
              <h4 className="mt-2 text-md font-semibold">ETAPAS</h4>
              {(project.etapas || []).map((stage) => (
                <div key={stage.id_etapa} className="mb-2 rounded-lg border-b border-neutro-3 p-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-md font-semibold">{stage.etapa_nombre}</h5>
                    <span className="rounded bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {stage.estado_nombre}
                    </span>
                  </div>
                  {(stage.tareas || []).map((task) => (
                    <div key={task.id_tarea} className="ml-4 mt-2">
                      <p className="text-sm">
                        {task.tarea_nombre} ({task.tarea_estado_nombre})
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </Card>

            <Card className="rounded-lg border border-neutro-3 p-4">
              <h4 className="mb-3 text-md font-semibold">ÚLTIMOS REGISTROS</h4>
              {reports.length > 0 ? (
                <ul className="space-y-2">
                  {reports.slice(0, 5).map((report) => (
                    <li
                      key={report.id}
                      className="flex items-center justify-between rounded-md border border-neutro-3 px-3 py-2 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <CalendarDays size={14} />
                        {formatDate(report.date)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span>{report.progressPercentage ?? 0}%</span>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2 py-1 text-xs"
                          onClick={() => handleReportDetail(report.id)}
                        >
                          Ver detalle
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No hay registros diarios para esta obra.</p>
              )}
            </Card>
          </div>
>>>>>>> Stashed changes

          <div>
            <div className="mb-4 flex gap-2">
              <input
                type="number"
                placeholder="Mes"
                min="1"
                max="12"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="w-24 rounded border px-3 py-2"
              />

              <input
                type="number"
                placeholder="Año"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="w-28 rounded border px-3 py-2"
              />
            </div>

            <Button
              variant="secondary"
              className="mb-4 w-1/2"
              onClick={() => {
                void handleGenerateAnalysis();
              }}
              disabled={!canGenerateIA || analysisLoading}
              isLoading={analysisLoading}
            >
              <Flower className="mr-2 inline" />
              GENERAR ANÁLISIS IA
            </Button>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
        </Card>
      </div>
    </>
  );
};

export default ObraDetalle;
