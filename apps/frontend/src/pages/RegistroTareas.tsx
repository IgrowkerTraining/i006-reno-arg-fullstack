import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Hammer, Paintbrush, Wrench, Zap, Home } from "lucide-react";
import { ROUTE_BUILDERS } from "../constants/routes";
import { api } from "../services/api";
import { getReportDraft, saveReportDraft } from "../utils/reportDraft";

type ChecklistOption = {
  id: string;
  label: string;
};

const FALLBACK_TAREAS: ChecklistOption[] = [
  { id: "4", label: "Levantamiento de tabique" },
  { id: "8", label: "Embutido" },
  { id: "9", label: "Canalización" },
  { id: "10", label: "Revoque fino" },
  { id: "12", label: "Carpeta" },
  { id: "13", label: "Impermeabilización" },
];

const FALLBACK_OFICIOS: ChecklistOption[] = [
  { id: "1", label: "Albañilería" },
  { id: "2", label: "Electricidad" },
  { id: "3", label: "Plomería" },
  { id: "4", label: "Pinturería" },
  { id: "5", label: "Techista" },
];

const getOficioIcon = (label: string) => {
  const normalized = label.toLowerCase();

  if (normalized.includes("alba")) return <Hammer size={16} strokeWidth={2} />;
  if (normalized.includes("electric")) return <Zap size={16} strokeWidth={2} />;
  if (normalized.includes("plomer")) return <Wrench size={16} strokeWidth={2} />;
  if (normalized.includes("pint")) return <Paintbrush size={16} strokeWidth={2} />;
  if (normalized.includes("techi")) return <Home size={16} strokeWidth={2} />;

  return <Wrench size={16} strokeWidth={2} />;
};

const RegistroTareas = () => {
  const { obraId } = useParams<{ obraId: string }>();
  const navigate = useNavigate();

  const [tareasOptions, setTareasOptions] = useState<ChecklistOption[]>([]);
  const [oficiosOptions, setOficiosOptions] = useState<ChecklistOption[]>([]);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState<string[]>([]);
  const [oficiosSeleccionados, setOficiosSeleccionados] = useState<string[]>([]);
  const [setupError, setSetupError] = useState("");

  useEffect(() => {
    if (!obraId) return;

    const loadSetup = async () => {
      const draft = getReportDraft(obraId);

      setTareasSeleccionadas(draft.selectedTasks ?? []);
      setOficiosSeleccionados(draft.selectedTrades ?? []);

      try {
        const setup = await api.getReportSetup();

        if (Array.isArray(setup?.tasks)) {
          const backendTaskOptions: ChecklistOption[] = [];

          setup.tasks.forEach((stage: any) => {
            stage.tareas?.forEach((task: any) => {
              backendTaskOptions.push({
                id: String(task.id_tarea),
                label: task.nombre_tarea,
              });
            });
          });

          if (backendTaskOptions.length) {
            const uniqueTasks = backendTaskOptions.filter(
              (option, index, source) =>
                source.findIndex((item) => item.id === option.id) === index
            );
            setTareasOptions(uniqueTasks);
          } else {
            setTareasOptions(FALLBACK_TAREAS);
          }
        } else {
          setTareasOptions(FALLBACK_TAREAS);
        }

        if (Array.isArray(setup?.trades) && setup.trades.length) {
          setOficiosOptions(
            setup.trades.map((trade: any) => ({
              id: String(trade.id_trade),
              label: trade.name,
            }))
          );
        } else {
          setOficiosOptions(FALLBACK_OFICIOS);
        }
      } catch {
        setSetupError("No se pudo cargar el formulario.");
        setTareasOptions(FALLBACK_TAREAS);
        setOficiosOptions(FALLBACK_OFICIOS);
      }
    };

    loadSetup();
  }, [obraId]);

  if (!obraId) return null;

  const toggleTarea = (id: string) => {
    setTareasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleOficio = (id: string) => {
    setOficiosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    saveReportDraft(obraId, {
      selectedTasks: tareasSeleccionadas,
      selectedTrades: oficiosSeleccionados,
    });

    navigate(ROUTE_BUILDERS.obraRegistroSeguridad(obraId));
  };

  const handleBack = () => {
    navigate(ROUTE_BUILDERS.obraDetalle(obraId));
  };

  return (
    <div className="flex w-full justify-center px-4 py-6 lg:px-6">
      <div className="w-full max-w-[980px] lg:-translate-x-4">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          {/* Header */}
          <div className="flex items-start justify-between bg-primary px-8 py-6 text-white md:px-10">
            <div>
              <h1 className="text-3xl font-semibold leading-tight">
                Reforma Vivienda Familiar
              </h1>
              <p className="mt-1 text-sm font-normal opacity-95">
                Registro diario de obra 13/02/26
              </p>
            </div>

            <div className="text-right">
              <p className="text-4xl font-semibold leading-none">45%</p>
              <p className="mt-2 text-sm uppercase tracking-normal opacity-95">
                Avance actual
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="px-8 pt-5 md:px-10">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold uppercase md:gap-6">
              <div className="flex items-center gap-3 text-cyan-600">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-base text-white">
                  1
                </div>
                <span>Tareas</span>
              </div>

              <div className="h-[2px] w-16 bg-cyan-500 md:w-24" />

              <div className="flex items-center gap-3 text-gray-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-base text-gray-500">
                  2
                </div>
                <span>Seguridad y ART</span>
              </div>

              <div className="h-[2px] w-16 bg-gray-200 md:w-24" />

              <div className="flex items-center gap-3 text-gray-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-base text-gray-500">
                  3
                </div>
                <span>Finalizar</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 pb-8 pt-6 md:px-10 md:pb-10">
            <div className="max-w-4xl">
              {setupError ? (
                <p className="mb-5 text-sm text-red-600">{setupError}</p>
              ) : null}

              {/* Tareas */}
              <section className="max-w-4xl">
                <h2 className="mb-8 text-[22px] font-semibold text-slate-900 md:text-[24px]">
                  ¿Qué tareas se realizaron hoy?
                </h2>

                <div className="grid grid-cols-1 gap-x-20 gap-y-6 md:grid-cols-2">
                  {tareasOptions.map((tarea) => {
                    const checked = tareasSeleccionadas.includes(tarea.id);

                    return (
                      <label
                        key={tarea.id}
                        className="flex min-h-[44px] cursor-pointer items-center gap-4 text-[18px] font-medium text-slate-800"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTarea(tarea.id)}
                          className="h-7 w-7 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{tarea.label}</span>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Oficios */}
              <section className="mt-12 max-w-4xl">
                <h3 className="mb-6 text-[22px] font-semibold text-slate-900 md:text-[24px]">
                  Oficios en obra
                </h3>

                <div className="flex flex-wrap gap-4">
                  {oficiosOptions.map((oficio) => {
                    const selected = oficiosSeleccionados.includes(oficio.id);

                    return (
                      <button
                        key={oficio.id}
                        type="button"
                        onClick={() => toggleOficio(oficio.id)}
                        className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border px-5 py-3 text-lg font-medium transition ${
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-indigo-300 bg-white text-indigo-500 hover:border-primary hover:text-primary"
                        }`}
                      >
                        <span className="flex h-5 w-5 items-center justify-center">
                          {getOficioIcon(oficio.label)}
                        </span>
                        <span className="leading-none">{oficio.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Footer */}
              <div className="mt-14 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-[28px] font-normal text-slate-500 transition hover:text-slate-700"
                >
                  ← Atrás
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={tareasSeleccionadas.length === 0}
                  className="rounded-xl bg-primary px-8 py-4 text-xl font-semibold text-white shadow transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroTareas;