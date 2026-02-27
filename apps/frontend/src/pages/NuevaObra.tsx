import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Stepper } from "../components/common/Stepper";
import { ROUTES } from "../constants/routes";
import { api, CreateProjectPayload } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import RenderGeneralStep from "../components/nuevaObra/RenderGeneralStep";
import RenderResponsableStep from "../components/nuevaObra/RenderResponsableStep";
import { NuevaObraForm, PlanningCatalogResponse, SistemaConstructivo, StepThreeView } from "../types";
import RenderSistemaSeleccionStep from "../components/nuevaObra/RenderSistemaSeleccionStep";
import RenderPlanificacionStep from "../components/nuevaObra/RenderPlanificacionStep";
import RenderArtStep from "../components/nuevaObra/RenderArtStep";
import { ART_PROVIDERS, FALLBACK_SYSTEM_IDS, FALLBACK_TASK_IDS, PLANNING_GROUPS, STEPS } from "../components/nuevaObra/constants";
import { normalizeText } from "../utils/normalizeText";


const MIS_OBRAS_PATH = `${ROUTES.DASHBOARD}/${ROUTES.MIS_OBRAS}`;

const createInitialTasks = () =>
  PLANNING_GROUPS.reduce<Record<string, string[]>>((accumulator, group) => {
    const initialTask = group.id === "demolicion" ? [group.tasks[0]] : [];
    return { ...accumulator, [group.id]: initialTask };
  }, {});

const NuevaObra: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [stepThreeView, setStepThreeView] = useState<StepThreeView>("seleccion");
  const [planningCatalog, setPlanningCatalog] =
    useState<PlanningCatalogResponse | null>(null);
  const [artProviders, setArtProviders] = useState(ART_PROVIDERS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [catalogWarning, setCatalogWarning] = useState<string | null>(null);
  const [formData, setFormData] = useState<NuevaObraForm>({
    projectName: "",
    location: "",
    surface: "",
    managerName: "",
    licenseNumber: "",
    systemType: "tradicional",
    artProvider: "",
    artCoverageConfirmed: false,
  });
  const [selectedTasks, setSelectedTasks] = useState<Record<string, string[]>>(
    createInitialTasks,
  );


  useEffect(() => {
    const loadPlanningCatalog = async () => {
      try {
        const catalog = await api.getPlanningCatalog();
        setPlanningCatalog(catalog);

        if (catalog.artsCoverage?.length) {
          setArtProviders(
            catalog.artsCoverage.map((item) => ({
              id: String(item.id_art),
              name: item.name,
            })),
          );
        }
      } catch {
        setCatalogWarning(
          "No se pudo obtener el catalogo completo. Se usaran opciones locales.",
        );
      }
    };

    loadPlanningCatalog();
  }, []);

  
useEffect(() => {
  if (!user) return;

  setFormData((previous) => ({
    ...previous,
    managerName: [user.name, user.lastName]
  .filter(Boolean)
  .join(" "),
   /*  licenseNumber: user.licenseNumber ?? "" , */
  }));
}, [user]);


  const creationDate = useMemo(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }, []);



  const selectedTaskLists = Object.values(selectedTasks) as string[][];

  const selectedTasksCount = useMemo(
    () =>
      selectedTaskLists.reduce(
        (accumulator, list) => accumulator + list.length,
        0,
      ),
    [selectedTasks],
  );

  const canContinue =
    step === 0
      ? Boolean(
        formData.projectName.trim() &&
        formData.location.trim() &&
        formData.surface.trim(),
      )
      : step === 1
        ? Boolean(
          formData.managerName.trim() && formData.licenseNumber.trim(),
        )
        : stepThreeView === "planificacion"
          ? selectedTasksCount > 0
          : stepThreeView === "art"
            ? Boolean(
              formData.artProvider.trim() && formData.artCoverageConfirmed,
            )
            : true;

  const getSystemId = () => {
    const normalizedSelection = normalizeText(formData.systemType);

    const matchFromCatalog = planningCatalog?.systems.find((system) =>
      normalizeText(system.name).includes(normalizedSelection),
    );

    return matchFromCatalog?.id_system ?? FALLBACK_SYSTEM_IDS[formData.systemType];
  };

  const getSelectedTasksByStage = () => {
    const selectedTaskNames = Object.values(selectedTasks).flat() as string[];
    const groupedByStage = new Map<number, Set<number>>();
    const catalogStages = planningCatalog?.planningStructure ?? [];

    selectedTaskNames.forEach((taskName) => {
      const normalizedTask = normalizeText(taskName);
      let mappedStageId: number | null = null;
      let mappedTaskId: number | null = null;

      for (const stage of catalogStages) {
        const stageTask = stage.tasks.find((task) => {
          const normalizedCatalogTask = normalizeText(task.name);
          return (
            normalizedCatalogTask === normalizedTask ||
            normalizedCatalogTask.includes(normalizedTask) ||
            normalizedTask.includes(normalizedCatalogTask)
          );
        });

        if (stageTask) {
          mappedStageId = stage.id;
          mappedTaskId = stageTask.id;
          break;
        }
      }

      if (mappedStageId === null || mappedTaskId === null) {
        const fallbackMatch = FALLBACK_TASK_IDS[normalizedTask];
        if (fallbackMatch) {
          mappedStageId = fallbackMatch.stageId;
          mappedTaskId = fallbackMatch.taskId;
        }
      }

      if (mappedStageId !== null && mappedTaskId !== null) {
        const stageTasks = groupedByStage.get(mappedStageId) ?? new Set<number>();
        stageTasks.add(mappedTaskId);
        groupedByStage.set(mappedStageId, stageTasks);
      }
    });

    return groupedByStage;
  };

  const createProject = async () => {
    if (!user?.id) {
      setSubmitError("No se pudo identificar el usuario logueado.");
      return;
    }

    const selectedTasksByStage = getSelectedTasksByStage();
    const startDate = new Date().toISOString().split("T")[0];

    const etapas: CreateProjectPayload["etapas"] = Array.from(
      selectedTasksByStage.entries(),
    ).map(([stageId, taskIds]) => ({
      id_tipo_etapa: stageId,
      fecha_inicio: startDate,
      tareas: Array.from(taskIds),
    }));

    if (!etapas.length) {
      setSubmitError("Selecciona al menos una tarea para crear la obra.");
      return;
    }

    const parsedSurface = Number(
      formData.surface.replace(",", ".").replace(/[^0-9.]+/g, ""),
    );

    const payload: CreateProjectPayload = {
      nombre: formData.projectName.trim(),
      ubicacion: formData.location.trim(),
      superficie_m2: Number.isFinite(parsedSurface) ? parsedSurface : 0,
      id_responsable: Number(user.id),
      matricula_responsable: formData.licenseNumber.trim(),
      id_sistema_constructivo: getSystemId(),
      etapas,
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const createdProject = await api.createProject(payload);
      const createdProjectId = createdProject?.id ?? createdProject?.id_proyecto;
      const selectedArtId = Number(formData.artProvider);

      if (createdProjectId && Number.isFinite(selectedArtId) && selectedArtId > 0) {
        try {
          await api.updateProjectArt(createdProjectId, selectedArtId);
        } catch {
          setCatalogWarning(
            "La obra se creo, pero no se pudo actualizar la cobertura ART.",
          );
        }
      }

      navigate(MIS_OBRAS_PATH);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo crear la obra.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange =
    (field: keyof NuevaObraForm) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((previous) => ({ ...previous, [field]: event.target.value }));
      };

  const handleBack = () => {
    if (step === 0) {
      navigate(MIS_OBRAS_PATH);
      return;
    }

    if (step === 2 && stepThreeView === "art") {
      setStepThreeView("planificacion");
      return;
    }

    if (step === 2 && stepThreeView === "planificacion") {
      setStepThreeView("seleccion");
      return;
    }

    setStep((previous) => previous - 1);
  };

  const handleNext = async () => {
    if (step === 2 && stepThreeView === "seleccion") {
      setStepThreeView("planificacion");
      return;
    }

    if (step === 2 && stepThreeView === "planificacion") {
      setStepThreeView("art");
      return;
    }

    if (step < STEPS.length - 1) {
      setStep((previous) => previous + 1);
      if (step + 1 === 2) {
        setStepThreeView("seleccion");
      }
      return;
    }

    await createProject();
  };


  const renderStepContent = () => {
    if (step === 0) return <RenderGeneralStep formData={formData} handleInputChange={handleInputChange} />;
    if (step === 1) return <RenderResponsableStep formData={formData} handleInputChange={handleInputChange} />;
    if (stepThreeView === "seleccion") return <RenderSistemaSeleccionStep formData={formData} setFormData={setFormData} />;
    if (stepThreeView === "planificacion") return <RenderPlanificacionStep formData={formData} selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks}/>;
    return <RenderArtStep formData={formData} setFormData={setFormData} creationDate={creationDate} artProviders={artProviders} />;
  };

  const nextLabel =
    step === 2 && stepThreeView === "art"
      ? "Crear nueva obra"
      : step === 2 && stepThreeView === "planificacion"
        ? "Continuar"
        : "Siguiente";

  return (
    <div className="mx-auto w-full max-w-4xl pb-10">
      <Card className="overflow-hidden rounded-[38px] border-neutro-3">
        <header className="bg-secondary-plus px-10 py-6 text-white">
          <h1 className="text-2xl font-bold uppercase">Alta de nueva obra</h1>
          <p className="mt-1 text-sm text-white/90">
            {step === 0
              ? `Fecha de creacion ${creationDate}`
              : "Proyecto RENO Studio"}
          </p>
        </header>

        <div className="space-y-6 p-6 md:p-8">
          <Stepper steps={STEPS} currentStep={Math.min(step, 2)} />

          {renderStepContent()}

          {catalogWarning ? (
            <p className="text-sm text-amber-700">{catalogWarning}</p>
          ) : null}

          {submitError ? (
            <p className="text-sm text-red-600">{submitError}</p>
          ) : null}

          <footer className="flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={handleBack} disabled={isSubmitting}>
              <ChevronLeft size={16} className="mr-1" />
              Atras
            </Button>

            <Button
              type="button"
              onClick={() => {
                void handleNext();
              }}
              disabled={!canContinue || isSubmitting}
              isLoading={isSubmitting}
            >
              {nextLabel}
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </footer>
        </div>
      </Card>
    </div>
  );
};

export default NuevaObra;
