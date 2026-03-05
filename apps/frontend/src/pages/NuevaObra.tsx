import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Hammer,
  MapPin,
  Maximize2,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Stepper } from "../components/common/Stepper";
import { ROUTES } from "../constants/routes";
import { api, CreateProjectPayload } from "../services/api";
import { useAuth } from "../hooks/useAuth";

type SistemaConstructivo = "tradicional" | "seco" | "mixto";
type StepThreeView = "seleccion" | "planificacion" | "art";

interface NuevaObraForm {
  projectName: string;
  location: string;
  surface: string;
  systemType: SistemaConstructivo;
  artProvider: string;
  artCoverageConfirmed: boolean;
}

interface PlanningGroup {
  id: string;
  title: string;
  tasks: string[];
}

interface PlanningCatalogTask {
  id: number;
  name: string;
}

interface PlanningCatalogStage {
  id: number;
  name: string;
  tasks: PlanningCatalogTask[];
}

interface PlanningCatalogResponse {
  systems: Array<{ id_system: number; name: string }>;
  planningStructure: PlanningCatalogStage[];
  artsCoverage: Array<{ id_art: number; name: string }>;
}

const STEPS = ["General", "Sistema y planificacion"];

const SYSTEM_OPTIONS: Array<{
  id: SistemaConstructivo;
  title: string;
  description: string;
}> = [
  {
    id: "tradicional",
    title: "Tradicional",
    description: "Ladrillos, revoque humedo, hormigon.",
  },
  {
    id: "seco",
    title: "En seco (Durlock)",
    description: "Placas de yeso y perfiles de acero",
  },
  {
    id: "mixto",
    title: "Mixto",
    description: "Ambos",
  },
];

const PLANNING_GROUPS: PlanningGroup[] = [
  {
    id: "demolicion",
    title: "Demolicion y retiros",
    tasks: [
      "Picado de pared",
      "Retiro de aberturas",
      "Levantamiento de pisos",
      "Limpieza de retiro",
    ],
  },
  {
    id: "obra-gruesa",
    title: "Obra gruesa",
    tasks: [
      "Levantamiento de tabique",
      "Contrapiso",
      "Carpeta",
      "Revoque fino",
    ],
  },
  {
    id: "instalaciones",
    title: "Instalaciones",
    tasks: [
      "Canalizacion electrica",
      "Instalacion sanitaria",
      "Instalacion de gas",
    ],
  },
  {
    id: "terminaciones",
    title: "Terminaciones",
    tasks: [
      "Pintura interior",
      "Colocacion de revestimientos",
      "Carpinterias",
    ],
  },
];

const ART_PROVIDERS = [
  { id: "1", name: "Provincia ART" },
  { id: "2", name: "La Segunda ART" },
  { id: "3", name: "Prevencion ART" },
  { id: "4", name: "Swiss Medical ART" },
];

const FALLBACK_SYSTEM_IDS: Record<SistemaConstructivo, number> = {
  tradicional: 1,
  seco: 2,
  mixto: 3,
};

const FALLBACK_TASK_IDS: Record<string, { stageId: number; taskId: number }> = {
  "picado de pared": { stageId: 1, taskId: 1 },
  "retiro de aberturas": { stageId: 1, taskId: 2 },
  "levantamiento de pisos": { stageId: 1, taskId: 3 },
  "levantamiento de tabique": { stageId: 2, taskId: 4 },
  contrapiso: { stageId: 2, taskId: 5 },
  carpeta: { stageId: 2, taskId: 6 },
  "revoque fino": { stageId: 4, taskId: 12 },
  "canalizacion electrica": { stageId: 3, taskId: 8 },
  "instalacion sanitaria": { stageId: 3, taskId: 9 },
  "instalacion de gas": { stageId: 3, taskId: 10 },
  "pintura interior": { stageId: 5, taskId: 18 },
  "colocacion de revestimientos": { stageId: 5, taskId: 15 },
  carpinterias: { stageId: 5, taskId: 17 },
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const TEXT_FIELD_REGEX = /^[\p{L}\p{N}\s.,\-#/()]+$/u;

const sanitizeTextInput = (value: string) =>
  value.replace(/[^\p{L}\p{N}\s.,\-#/()]/gu, "");

const sanitizeSurfaceInput = (value: string) => {
  const normalized = value.replace(",", ".");
  const cleaned = normalized.replace(/[^0-9.]/g, "");
  const [integerPart, ...decimalParts] = cleaned.split(".");
  if (!decimalParts.length) return integerPart;
  return `${integerPart}.${decimalParts.join("")}`;
};

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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof NuevaObraForm, string>>>({});
  const [formData, setFormData] = useState<NuevaObraForm>({
    projectName: "",
    location: "",
    surface: "",
    systemType: "tradicional",
    artProvider: "",
    artCoverageConfirmed: false,
  });
  const [selectedTasks, setSelectedTasks] = useState<Record<string, string[]>>(
    createInitialTasks,
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const creationDate = useMemo(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }, []);

  const selectedSystem = useMemo(
    () => SYSTEM_OPTIONS.find((option) => option.id === formData.systemType),
    [formData.systemType],
  );

  const selectedTasksCount = useMemo(
    () =>
      Object.values(selectedTasks).reduce(
    (accumulator, list) => accumulator + list.length,
        0,
      ),
    [selectedTasks],
  );

  const isValidProjectName = (projectName: string) => {
    const trimmedValue = projectName.trim();
    return (
      trimmedValue.length >= 3 &&
      TEXT_FIELD_REGEX.test(trimmedValue) &&
      /[\p{L}\p{N}]/u.test(trimmedValue)
    );
  };

  const isValidLocation = (location: string) => {
    const trimmedValue = location.trim();
    return (
      trimmedValue.length >= 5 &&
      TEXT_FIELD_REGEX.test(trimmedValue) &&
      /[\p{L}\p{N}]/u.test(trimmedValue)
    );
  };

  const isValidSurface = (surface: string) => {
    const parsedSurface = Number(surface.replace(",", ".").replace(/[^0-9.]+/g, ""));
    return Number.isFinite(parsedSurface) && parsedSurface > 0;
  };

  const canContinue =
    step === 0
      ? Boolean(
          isValidProjectName(formData.projectName) &&
            isValidLocation(formData.location) &&
            isValidSurface(formData.surface),
        )
      : stepThreeView === "planificacion"
          ? selectedTasksCount > 0
        : stepThreeView === "art"
            ? Boolean(
                formData.artProvider.trim() && formData.artCoverageConfirmed,
              )
            : true;

  const validateCurrentStep = () => {
    const nextErrors: Partial<Record<keyof NuevaObraForm, string>> = {};

    if (step === 0) {
      if (!isValidProjectName(formData.projectName)) {
        nextErrors.projectName = "Ingresá un nombre de al menos 3 caracteres.";
      }
      if (!isValidLocation(formData.location)) {
        nextErrors.location = "Ingresá una ubicación válida.";
      }
      if (!isValidSurface(formData.surface)) {
        nextErrors.surface = "Ingresá una superficie numérica mayor a 0.";
      }
    }

    if (step === 1 && stepThreeView === "art") {
      if (!formData.artProvider.trim()) {
        nextErrors.artProvider = "Seleccioná una ART.";
      }
      if (!formData.artCoverageConfirmed) {
        nextErrors.artCoverageConfirmed = "Debes confirmar la cobertura vigente.";
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const getSystemId = () => {
    const normalizedSelection = normalizeText(formData.systemType);

    const matchFromCatalog = planningCatalog?.systems.find((system) =>
      normalizeText(system.name).includes(normalizedSelection),
    );

    return matchFromCatalog?.id_system ?? FALLBACK_SYSTEM_IDS[formData.systemType];
  };

  const getSelectedTasksByStage = () => {
    const selectedTaskNames = Object.values(selectedTasks).flat();
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
      matricula_responsable: "NO-0000",
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
      let nextValue = event.target.value;
      if (field === "surface") {
        nextValue = sanitizeSurfaceInput(nextValue);
      }
      if (field === "projectName" || field === "location") {
        nextValue = sanitizeTextInput(nextValue);
      }

      if (fieldErrors[field]) {
        setFieldErrors((previous) => ({ ...previous, [field]: "" }));
      }
      setFormData((previous) => ({ ...previous, [field]: nextValue }));
    };

  const handleBack = () => {
    if (step === 0) {
      navigate(MIS_OBRAS_PATH);
      return;
    }

    if (step === 1 && stepThreeView === "art") {
      setStepThreeView("planificacion");
      return;
    }

    if (step === 1 && stepThreeView === "planificacion") {
      setStepThreeView("seleccion");
      return;
    }

    setStep((previous) => previous - 1);
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (step === 1 && stepThreeView === "seleccion") {
      setStepThreeView("planificacion");
      return;
    }

    if (step === 1 && stepThreeView === "planificacion") {
      setStepThreeView("art");
      return;
    }

    if (step < STEPS.length - 1) {
      setStep((previous) => previous + 1);
      if (step + 1 === 1) {
        setStepThreeView("seleccion");
      }
      return;
    }

    await createProject();
  };

  const toggleTask = (groupId: string, task: string) => {
    setSelectedTasks((previous) => {
      const currentList = previous[groupId] ?? [];
      const updatedList = currentList.includes(task)
        ? currentList.filter((item) => item !== task)
        : [...currentList, task];

      return {
        ...previous,
        [groupId]: updatedList,
      };
    });
  };

  const handleArtCoverageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (fieldErrors.artCoverageConfirmed) {
      setFieldErrors((previous) => ({ ...previous, artCoverageConfirmed: "" }));
    }
    setFormData((previous) => ({
      ...previous,
      artCoverageConfirmed: event.target.checked,
    }));
  };

  const handleArtProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (fieldErrors.artProvider) {
      setFieldErrors((previous) => ({ ...previous, artProvider: "" }));
    }
    setFormData((previous) => ({ ...previous, artProvider: event.target.value }));
  };

  const handleOpenFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedList = event.target.files ? Array.from(event.target.files) : [];
    if (!selectedList.length) return;

    setUploadedFiles((previous) => [...previous, ...selectedList]);
    event.target.value = "";
  };

  const renderGeneralStep = () => (
    <section className="space-y-4">
      <div className="rounded-sm border-l-2 border-secondary pl-3">
        <h2 className="text-lg font-semibold text-neutro-1">Datos generales</h2>
        <p className="text-sm text-slate-500">
          Identifica el proyecto para el seguimiento diario.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xl uppercase tracking-wide text-neutro-1">
          Nombre del proyecto
        </label>
        <Input
          icon={<Building2 size={16} />}
          value={formData.projectName}
          error={fieldErrors.projectName}
          onChange={handleInputChange("projectName")}
          placeholder="Ej. Reforma Casa Caballito"
          className="rounded-md border-secondary bg-[#ECECEF] text-base placeholder:text-slate-400"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xl uppercase tracking-wide text-neutro-1">
          Ubicacion / direccion
        </label>
        <Input
          icon={<MapPin size={16} />}
          value={formData.location}
          error={fieldErrors.location}
          onChange={handleInputChange("location")}
          placeholder="Calle, numero y localidad"
          className="rounded-md border-transparent bg-[#ECECEF] text-base placeholder:text-slate-400"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xl uppercase tracking-wide text-neutro-1">
          Superficie estimada
        </label>
        <Input
          icon={<Maximize2 size={16} />}
          value={formData.surface}
          error={fieldErrors.surface}
          onChange={handleInputChange("surface")}
          inputMode="decimal"
          placeholder="Superficie estimada (m2)"
          className="rounded-md border-transparent bg-[#ECECEF] text-base placeholder:text-slate-400"
        />
      </div>
    </section>
  );

  const renderSistemaSeleccionStep = () => (
    <section className="space-y-5">
      <div className="rounded-sm border-l-2 border-secondary pl-3">
        <h2 className="text-lg font-semibold text-neutro-1">Sistema Constructivo</h2>
        <p className="text-sm text-slate-500">
          Selecciona el metodo predominante de la intervencion.
        </p>
      </div>

      <div className="space-y-2">
        {SYSTEM_OPTIONS.map((option) => {
          const isSelected = formData.systemType === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setFormData((previous) => ({ ...previous, systemType: option.id }))
              }
              className={`w-full rounded-md border px-4 py-3 text-left transition-colors ${
                isSelected
                  ? "border-[#BAC1D8] bg-[#EEF0F7]"
                  : "border-[#D8DCEA] bg-white hover:border-[#BAC1D8]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-primary">{option.title}</h3>
                  <p className="text-base text-neutro-1">{option.description}</p>
                </div>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? "border-primary text-primary"
                      : "border-primary text-transparent"
                  }`}
                >
                  <Check size={18} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );

  const renderPlanificacionStep = () => (
    <section className="space-y-5">
      <div className="rounded-sm border-l-2 border-secondary pl-3">
        <h2 className="text-lg font-semibold text-neutro-1">Sistema Constructivo</h2>
        <p className="text-sm text-slate-500">
          Selecciona el metodo predominante de la intervencion.
        </p>
      </div>

      <div className="rounded-md border border-[#BAC1D8] bg-[#EEF0F7] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-primary">{selectedSystem?.title}</h3>
            <p className="text-base text-neutro-1">{selectedSystem?.description}</p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-primary">
            <Check size={18} />
          </span>
        </div>
      </div>

      <Card className="border-[#CAD3EC] bg-[#FBFCFF] p-0">
        <div className="rounded-t-xl bg-primary/8 px-4 py-3">
          <h3 className="flex items-center gap-2 text-xl font-semibold uppercase text-primary">
            <Hammer size={16} />
            Planificacion de etapas
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Tilda las tareas que formaran parte de esta obra.
          </p>
        </div>

        <div className="max-h-64 space-y-4 overflow-y-auto p-4 pr-3">
          {PLANNING_GROUPS.map((group) => (
            <div key={group.id} className="rounded-md border border-[#DBE0EF] bg-white">
              <h4 className="rounded-t-md bg-[#DFE5F8] px-3 py-2 text-lg font-semibold uppercase text-primary">
                {group.title}
              </h4>
              <div className="space-y-2 px-3 py-3">
                {group.tasks.map((task) => {
                  const checked = (selectedTasks[group.id] ?? []).includes(task);

                  return (
                    <label key={task} className="flex items-center gap-2 text-base text-neutro-1">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTask(group.id, task)}
                        className="h-4 w-4 rounded border-slate-300 accent-primary"
                      />
                      {task}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );

  const renderArtStep = () => (
    <section className="space-y-5">
      <h2 className="text-4xl font-bold text-neutro-1">
        {formData.projectName.trim() || "Nueva obra"}
      </h2>

      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} />
          {formData.location.trim() || "Ubicacion sin definir"}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          Fecha de inicio: {creationDate}
        </span>
        <span className="flex items-center gap-1.5">
          <Maximize2 size={14} />
          Superficie: {formData.surface.trim() || "-"} m2
        </span>
      </div>

      <Card className="border-secondary bg-[#D9ECF1] p-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-secondary bg-white/50 p-4 text-center">
            <Upload size={20} className="mx-auto text-primary" />
            <h3 className="mt-2 text-lg font-semibold text-primary">Cargar documentacion</h3>
            <p className="mt-1 text-xs text-slate-600">
              Certificado de cobertura o constancia de no repeticion.
            </p>
            <div className="mt-3 flex justify-center">
              <Button type="button" variant="outline" onClick={handleOpenFileSelector}>
                <FileText size={16} className="mr-1" />
                Adjuntar
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            {uploadedFiles.length ? (
              <p className="mt-2 text-xs text-slate-600">
                {uploadedFiles.length} archivo(s) cargado(s)
              </p>
            ) : null}
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-neutro-1">
              Seguridad e Higiene y ART
            </h3>
            <p className="text-xs text-slate-600">Aseguradora</p>
            <select
              value={formData.artProvider}
              onChange={handleArtProviderChange}
              className="w-full rounded-md border border-[#B8D8E3] bg-white px-3 py-2.5 text-sm text-neutro-1 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Selecciona ART</option>
              {artProviders.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
            {fieldErrors.artProvider ? (
              <p className="text-xs text-red-600">{fieldErrors.artProvider}</p>
            ) : null}

            <label className="flex items-center gap-2 text-sm text-neutro-1">
              <input
                type="checkbox"
                checked={formData.artCoverageConfirmed}
                onChange={handleArtCoverageChange}
                className="h-4 w-4 rounded border-slate-300 accent-primary"
              />
              Declaro cobertura vigente para todo el personal.
            </label>
            {fieldErrors.artCoverageConfirmed ? (
              <p className="text-xs text-red-600">{fieldErrors.artCoverageConfirmed}</p>
            ) : null}

            <div className="flex items-start gap-2 rounded-md bg-white/60 px-3 py-2 text-xs text-slate-600">
              <ShieldCheck size={14} className="mt-0.5 text-primary" />
              <p>
                Verifica la cobertura antes de crear la obra para habilitar el
                seguimiento diario.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );

  const renderStepContent = () => {
    if (step === 0) return renderGeneralStep();
    if (stepThreeView === "seleccion") return renderSistemaSeleccionStep();
    if (stepThreeView === "planificacion") return renderPlanificacionStep();
    return renderArtStep();
  };

  const nextLabel =
    step === 1 && stepThreeView === "art"
      ? "Crear nueva obra"
      : step === 1 && stepThreeView === "planificacion"
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
          <Stepper steps={STEPS} currentStep={step} />

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
