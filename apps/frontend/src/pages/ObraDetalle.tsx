import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { Card } from "../components/common/Card";
import { BrickWall, CalendarCheck, CheckCircle, ChevronRight, Clock, FileText, Flower, Hammer, Home, MapPin, Scan, ShieldCheck, User, XCircle, Zap } from "lucide-react";
import { Button } from "../components/common/Button";
import { formatDate, formatDayMonth } from "../utils/formateDate";
import { Input } from "../components/common/Input";
import { useAuth } from "../hooks/useAuth";
import {  toUpperCase } from "../utils/capitalize";
import { ProgressBar } from "../components/common/ProgressBar";



const statusColors: Record<string, string> = {
  "Pendiente": "border-accent-2 text-accent-2",
  "Completado": "border",
};


const ObraDetalle: React.FC = () => {
  const { user } = useAuth()
  const { obraId } = useParams<string>();
  const [project, setProject] = useState(null);
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const navigate = useNavigate();

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("")


  const handleGenerateAnalysis = async () => {
    if (!obraId || !month || !year) return;

    try {
      setLoadingAnalysis(true);
      const response = await api.generateAnalysis(
        obraId,
        Number(month),
        Number(year)
      );

      navigate(`/dashboard/reporte-ia/${obraId}`, {
        state: {
          analysis: response,
          month,
          year,
        },
      });
    } catch (error) {
      console.error("Error generando análisis", error);
    } finally {
      setLoadingAnalysis(false);
    }
  };


  useEffect(() => {
    if (!obraId) return;

    const loadProject = async () => {
      try {
        setLoading(true);
        const project = await api.getProjectById(obraId);
        const projectReports = await api.getReportByProjectId(obraId);

        setProject(project);
        setReports(projectReports.data)

        setLoading(false)

      } catch {
        setProject(null);
        setReports([])
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
          <div className="flex flex-col h-[650px] overflow-y-auto gap-4">
            <Card className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl border-neutro-2">
              <div>
                <h3 className="text-sm font-semibold bg-accent/50 rounded-full px-4 py-1 w-fit">{project.code}</h3>
                <h1 className="text-3xl font-bold my-4">{project.name}</h1>
                <p className="mb-1 flex items-center text-sm"><MapPin className="inline mr-2 w-4 h-4" />{project.location} <span className="ml-4"><Scan className="inline mr-2 w-4 h-4" />{project.surfaceM2} m2</span></p>
                <p className="mb-4 text-sm mt-3"><User className="inline mr-2 w-4 h-4" />Responsable técnico:</p>
                <div className="flex gap-3">
                  <span className="w-10 h-10 bg-accent/50 rounded-full flex items-center justify-center text-primary text-sm font-bold">
                    {user?.name && user.lastName ? `${user.name.charAt(0)}${user.lastName.charAt(0)}` : "U"}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold">{project.manager.name} </span>
                    <span className="text-xs">{project.manager.license || "Sin matrícula"}</span>
                  </div>
                </div>
              </div>
            
                <Card className="p-6 mx-4 my-6 rounded-lg bg-neutro-3/60 border-neutro-3">
                  {loadingAnalysis ? (
                <p className="text-md text-neutro-1 animate-pulse">
                  Generando análisis con IA, esto puede tardar unos segundos...
                </p>
              ) :
                 (
                  <><p className="pb-2">Período a analizar:</p>
                  <div className="flex gap-2 mb-4">
                    <Input
                      type="number"
                      placeholder="Mes"
                      min="1"
                      max="12"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="rounded-md border-neutro-2 bg-white text-base placeholder:text-slate-400"
                    />
                    <Input
                      type="number"
                      placeholder="Año"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="rounded-md border-neutro-2 bg-white text-base placeholder:text-slate-400"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    className=" mb-4 w-full"
                    onClick={handleGenerateAnalysis}
                  >
                    <Flower className="inline mr-2" />
                    GENERAR ANALISIS IA
                  </Button>
                  </> )}
                </Card>
            </Card>

            <Card className="p-6 rounded-xl border-neutro-2">
              <h2 className="font-semibold text-xl"><Hammer className="inline text-secondary w-10 " /> Sistema constructivo</h2>
              <hr className="border-neutro-2 my-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs">SISTEMA</p>
                  <p className="font-bold">{project.config.constructionSystemName}</p>
                </div>
                <div>
                  <p className="text-xs">FECHA DE INICIO</p>
                  <p className="font-bold">{formatDate(project.registrationDate)}</p>
                </div>
              </div>

              <div className="w-3/4  ">
                <div className="flex justify-between text-sm font-semibold my-2">
                  <span className="">Obra gruesa</span>
                  <span>{20}%</span>
                </div>
                <ProgressBar value={20} />
              </div>
            </Card>
            <Card className="p-6 rounded-xl border-neutro-2">
              <h2 className="font-semibold text-xl">
                <CalendarCheck className="inline text-secondary w-10" /> Etapas planificadas
              </h2>

              <hr className="border-neutro-2 mt-4 mb-6" />

              {project?.stages?.length > 0 ? (
                project.stages.map((stage) => (
                  <div key={stage.id} className="mb-6">

                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">
                        {toUpperCase(stage.typeName)}
                      </h3>

                      <span
                        className={`px-4 py-2 text-sm rounded-full font-medium border ${statusColors[stage.statusName]}`}
                      >
                        {toUpperCase(stage.statusName)}
                        <Clock className="inline ml-2 w-4 h-4" />
                      </span>
                    </div>

                    {stage?.tasks?.length > 0 && (
                      <div className="ml-4 space-y-1 text-md text-gray-600">
                        {stage.tasks.map((task) => (
                          <p key={task.id}>• {task.typeName}</p>
                        ))}
                      </div>
                    )}

                  </div>
                ))
              ) : (
                <p>No se encontró información de las etapas</p>
              )}
            </Card>

            <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
              <Card className="p-6 rounded-xl border-neutro-2 h-full">
                <div className="md:flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-xl">
                    <ShieldCheck className="inline text-secondary w-10" /> Cobertura ART
                  </h2>
                  <span
                    className={`px-3 py-1 text-md flex items-center gap-1 w-fit ${project.config.artCoverageId === 1
                      ? "text-success"
                      : "text-accent-2"
                      }`}
                  >
                    {project?.config?.artCoverageId === 1 ? (
                      <>
                        VIGENTE <CheckCircle className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        NO VIGENTE <XCircle className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </div>
                <article className="w-full p-4 rounded-lg bg-secondary/50 my-2">
                  <p className="font-bold text-md">{project.config.artName}</p>
                  <p className="text-sm">Cobertura activa para todo el personal</p>
                </article>
              </Card>
              <Card className="p-6 rounded-xl border-neutro-2 h-full">

                <h2 className="font-semibold text-xl">
                  <Home className="inline text-secondary w-10" /> Oficios en obra
                </h2>
                <div className="flex p-4 gap-2">
                  <span className="rounded-2xl border border-primary py-1 px-3 text-primary font-semibold">
                    <BrickWall className="inline mr-2 w-4 h-4" /> Albañilería
                  </span>
                  <span className="rounded-2xl border border-primary py-1 px-3 text-primary font-semibold">
                    <Zap className="inline mr-2 w-4 h-4" /> Electricidad
                  </span>
                </div>

              </Card>
            </section>
            <Card className="p-6 rounded-xl border-neutro-2 min-h-[300px] flex flex-col">
              <div className="md:flex items-center justify-between mb-2">
                <h2 className="font-semibold text-xl">
                  <FileText className="inline text-secondary w-10" /> Registros diarios
                </h2>
                <span className="text-sm">Total de registros: {reports?.length} </span>
              </div>
              <ul className="flex flex-col gap-3 my-6 overflow-y-auto flex-1">
                {reports?.length > 0 ? (
                  reports.map((report) => {
                    const { day, month } = formatDayMonth(report.date);

                    return (
                      <React.Fragment key={report.id}>
                        <li className="grid grid-cols-1 md:grid-cols-2">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-lg text-white flex flex-col items-center justify-center leading-none">
                              <span className="text-lg font-bold">{day}</span>
                              <span className="text-[12px]">{month}</span>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-md">{report.comment !== "" ? report.comment : "Sin comentarios"}</p>
                              <p className="text-sm">Supervisor: {report.supervisor.name} <span className={`${report.validation.status === "PENDIENTE" ? "text-accent-2" : "text-primary"} ml-4`}>&bull; {report.validation.status}</span></p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-4 ">
                            <Button variant="accent" className="text-sm">VALIDAR REGISTRO</Button>
                            <span className="flex justify-end text-secondary-plus">{Math.round(Number(report.progressPercentage))}%</span>
                            <ChevronRight className="text-secondary-plus" onClick={()=>{}}/> 
                          </div>
                        </li>
                        <hr className="border-neutro-2" />
                      </React.Fragment>
                    );
                  })
                ) : (
                  <p>No hay registros disponibles</p>
                )}
              </ul>
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
