import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ChevronLeft, MapPin, Maximize2, ShieldCheck } from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { ROUTE_BUILDERS } from "../constants/routes";
import { api, ReportDetail } from "../services/api";

interface ProjectDetail {
  id: number;
  code: string;
  name: string;
  location: string;
  surfaceM2: number;
  config?: {
    artCoverageId?: number | null;
  };
}

interface ArtCoverageOption {
  id_art: number;
  name: string;
}

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("es-AR");
};

const DetalleRegistro: React.FC = () => {
  const { obraId, registroId } = useParams<{ obraId: string; registroId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [artCoverages, setArtCoverages] = useState<ArtCoverageOption[]>([]);

  useEffect(() => {
    if (!obraId || !registroId) return;

    const loadDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const [projectResponse, reportResponse] = await Promise.all([
          api.getProjectById(obraId),
          api.getReportById(registroId),
        ]);

        setProject(projectResponse);
        setReport(reportResponse);

        try {
          const catalog = await api.getPlanningCatalog();
          setArtCoverages(catalog.artsCoverage ?? []);
        } catch {
          setArtCoverages([]);
        }
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "No se pudo cargar el detalle del registro.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadDetail();
  }, [obraId, registroId]);

  const artCoverageName = useMemo(() => {
    const artCoverageId = project?.config?.artCoverageId;
    if (!artCoverageId) return "Sin cobertura ART registrada";

    const matchedCoverage = artCoverages.find(
      (coverage) => Number(coverage.id_art) === Number(artCoverageId),
    );

    return matchedCoverage?.name ?? `ART #${artCoverageId}`;
  }, [artCoverages, project?.config?.artCoverageId]);

  const handleBack = () => {
    if (!obraId) return;
    navigate(ROUTE_BUILDERS.obraDetalle(obraId));
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl pb-10">
        <p className="text-sm text-slate-500">Cargando detalle del registro...</p>
      </div>
    );
  }

  if (error || !project || !report) {
    return (
      <div className="mx-auto w-full max-w-5xl pb-10 space-y-4">
        <Button type="button" variant="ghost" onClick={handleBack}>
          <ChevronLeft size={16} className="mr-1" />
          Volver al listado
        </Button>
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error ?? "No se encontro el detalle solicitado."}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl pb-10 space-y-4">
      <Button type="button" variant="ghost" onClick={handleBack}>
        <ChevronLeft size={16} className="mr-1" />
        Volver al listado
      </Button>

      <Card className="space-y-3 border-neutro-2 p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-semibold text-neutro-1">
            {project.code}
          </span>
          <span className="text-sm text-slate-500">{formatDate(report.date)}</span>
        </div>
        <h1 className="text-4xl font-bold text-neutro-1">{project.name}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {project.location}
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 size={14} />
            {project.surfaceM2} m2
          </span>
        </div>
      </Card>

      <Card className="border-neutro-2 p-0">
        <div className="border-b border-neutro-2 px-5 py-4">
          <h2 className="text-xl font-semibold text-neutro-1">Tareas realizadas</h2>
        </div>
        <div className="space-y-4 p-5">
          {report.tasks?.length ? (
            report.tasks.map((task, index) => (
              <div key={`${task.task_name}-${index}`} className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold uppercase text-neutro-1">{task.task_name}</p>
                  <p className="text-xs text-slate-500">Registro del {formatDate(report.date)}</p>
                </div>
                <span className="rounded-full border border-green-500 px-4 py-1 text-xs font-semibold uppercase text-green-600">
                  {task.task_status || "Terminado"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No hay tareas asociadas a este registro.</p>
          )}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4 border-neutro-2 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-neutro-1">Cobertura ART</h3>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
              VIGENTE
              <ShieldCheck size={14} />
            </span>
          </div>
          <div className="rounded-xl bg-secondary/20 px-4 py-3">
            <p className="text-sm font-semibold text-primary">{artCoverageName}</p>
            <p className="text-xs text-slate-600">Cobertura activa para todo el personal.</p>
          </div>
        </Card>

        <Card className="space-y-4 border-neutro-2 p-5">
          <h3 className="text-xl font-semibold text-neutro-1">Seguridad e higiene</h3>
          <div className="space-y-2">
            {report.safety?.length ? (
              report.safety.map((item, index) => (
                <div
                  key={`${item.safety_description}-${index}`}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                    item.status
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-amber-300 bg-amber-50 text-amber-700"
                  }`}
                >
                  <span>{item.safety_description}</span>
                  {item.status ? "Cumple" : "Observado"}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No hay controles de seguridad registrados.</p>
            )}
          </div>
          {report.technicalComment ? (
            <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              <AlertCircle size={14} className="mt-0.5 text-primary" />
              <p>{report.technicalComment}</p>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
};

export default DetalleRegistro;
