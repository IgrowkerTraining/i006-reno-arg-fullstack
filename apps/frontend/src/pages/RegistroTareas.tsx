import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistroHeader from "../components/registro/RegistroHeader";
import ChecklistGroup from "../components/registro/ChecklistGroup";
import FooterActions from "../components/registro/FooterActions";
import { ROUTE_BUILDERS } from "../constants/routes";
import { api } from "../services/api";
import { getReportDraft, saveReportDraft } from "../utils/reportDraft";

type ChecklistOption = {
  id: string;
  label: string;
};

const FALLBACK_TAREAS: ChecklistOption[] = [
  { id: "4", label: "Levantamiento de tabique" },
  { id: "8", label: "Electrica" },
  { id: "9", label: "Sanitaria" },
  { id: "10", label: "Gas" },
  { id: "12", label: "Revoque fino" },
];

const FALLBACK_OFICIOS: ChecklistOption[] = [
  { id: "1", label: "Albañilería" },
  { id: "2", label: "Plomería" },
  { id: "3", label: "Electricidad" },
  { id: "4", label: "Pintura" },
];

const RegistroTareas = () => {
  const { obraId } = useParams<{ obraId: string }>();
  const navigate = useNavigate();

  const [tareasOptions, setTareasOptions] = useState<ChecklistOption[]>(FALLBACK_TAREAS);
  const [oficiosOptions, setOficiosOptions] = useState<ChecklistOption[]>(FALLBACK_OFICIOS);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState<string[]>([]);
  const [oficiosSeleccionados, setOficiosSeleccionados] = useState<string[]>([]);
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    if (!obraId) return;

    const loadSetup = async () => {
      const draft = getReportDraft(obraId);
      setTareasSeleccionadas(draft.selectedTasks.map(String));
      setOficiosSeleccionados(draft.selectedTrades.map(String));

      try {
        const setup = await api.getReportSetup(obraId);

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
                source.findIndex((item) => item.id === option.id) === index,
            );
            setTareasOptions(uniqueTasks);
          }
        }

        if (Array.isArray(setup?.trades) && setup.trades.length) {
          setOficiosOptions(
            setup.trades.map((trade: any) => ({
              id: String(trade.id_trade),
              label: trade.name,
            })),
          );
        }
      } catch {
        setSetupError("No se pudo cargar el catálogo del registro. Se usan opciones locales.");
      }
    };

    loadSetup();
  }, [obraId]);

  if (!obraId) return null;

  const handleNext = () => {
    saveReportDraft(obraId, {
      selectedTasks: tareasSeleccionadas.map(Number).filter(Number.isFinite),
      selectedTrades: oficiosSeleccionados.map(Number).filter(Number.isFinite),
    });
    navigate(ROUTE_BUILDERS.obraRegistroSeguridad(obraId));
  };

  const handleBack = () => {
    navigate(ROUTE_BUILDERS.obraDetalle(obraId));
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
        <div className="bg-primary px-8 py-6">
          <RegistroHeader
            obraNombre={`Obra ${obraId}`}
            fecha={new Date().toLocaleDateString()}
            porcentaje={45}
            pasoActual={1}
          />

          <FooterActions
            onBack={handleBack}
            onNext={handleNext}
            disableNext={tareasSeleccionadas.length === 0}
          />

        </div>

        <div className="bg-[#F5F5F7] p-8">
          <div className="space-y-8 rounded-2xl bg-white p-8 shadow-sm">
            {setupError ? <p className="text-sm text-amber-700">{setupError}</p> : null}

            <ChecklistGroup
              title="¿Qué tareas se realizaron?"
              options={tareasOptions}
              selected={tareasSeleccionadas}
              onChange={setTareasSeleccionadas}
            />

            <ChecklistGroup
              title="Oficios en obra"
              options={oficiosOptions}
              selected={oficiosSeleccionados}
              onChange={setOficiosSeleccionados}
            />

            <FooterActions
              onBack={handleBack}
              onNext={handleNext}
              disableNext={tareasSeleccionadas.length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroTareas;
