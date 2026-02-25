import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
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

type SistemaConstructivo = "tradicional" | "seco" | "mixto";
type StepThreeView = "seleccion" | "planificacion" | "art";

interface NuevaObraForm {
  projectName: string;
  location: string;
  surface: string;
  managerName: string;
  licenseNumber: string;
  systemType: SistemaConstructivo;
  artProvider: string;
  artCoverageConfirmed: boolean;
}

interface PlanningGroup {
  id: string;
  title: string;
  tasks: string[];
}

const STEPS = ["General", "Responsable", "Sistema y planificacion"];

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
  "Provincia ART",
  "La Segunda ART",
  "Prevencion ART",
  "Swiss Medical ART",
];

const MIS_OBRAS_PATH = `${ROUTES.DASHBOARD}/${ROUTES.MIS_OBRAS}`;

const createInitialTasks = () =>
  PLANNING_GROUPS.reduce<Record<string, string[]>>((accumulator, group) => {
    const initialTask = group.id === "demolicion" ? [group.tasks[0]] : [];
    return { ...accumulator, [group.id]: initialTask };
  }, {});

const NuevaObra: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [stepThreeView, setStepThreeView] = useState<StepThreeView>("seleccion");
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleNext = () => {
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

    navigate(MIS_OBRAS_PATH);
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
    setFormData((previous) => ({
      ...previous,
      artCoverageConfirmed: event.target.checked,
    }));
  };

  const handleArtProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
          onChange={handleInputChange("surface")}
          placeholder="Superficie estimada (m2)"
          className="rounded-md border-transparent bg-[#ECECEF] text-base placeholder:text-slate-400"
        />
      </div>
    </section>
  );

  const renderResponsableStep = () => (
    <section className="space-y-4">
      <div className="rounded-sm border-l-2 border-secondary pl-3">
        <h2 className="text-lg font-semibold text-neutro-1">Responsable</h2>
        <p className="text-sm text-slate-500">
          Toda obra debe estar validada por un profesional matriculado.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xl uppercase tracking-wide text-neutro-1">
          Nombre del responsable
        </label>
        <Input
          icon={<Building2 size={16} />}
          value={formData.managerName}
          onChange={handleInputChange("managerName")}
          placeholder="Arq./ MMO Apellido y Nombre"
          className="rounded-md border-secondary bg-[#ECECEF] text-base placeholder:text-slate-400"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xl uppercase tracking-wide text-neutro-1">
          Nro. de matricula
        </label>
        <Input
          icon={<MapPin size={16} />}
          value={formData.licenseNumber}
          onChange={handleInputChange("licenseNumber")}
          placeholder="CPAU/CAPBA Nro..."
          className="rounded-md border-transparent bg-[#ECECEF] text-base placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-700">
        <AlertCircle size={16} />
        <p>
          La informacion de la obra solo sera valida si cuenta con la validacion
          explicita de este responsable.
        </p>
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

      <div className="flex items-center gap-2 text-sm text-neutro-1">
        <CircleUserRound size={16} className="text-secondary-plus" />
        <span>
          {formData.managerName.trim() || "Responsable sin asignar"} - Matricula{" "}
          {formData.licenseNumber.trim() || "-"}
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
              {ART_PROVIDERS.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm text-neutro-1">
              <input
                type="checkbox"
                checked={formData.artCoverageConfirmed}
                onChange={handleArtCoverageChange}
                className="h-4 w-4 rounded border-slate-300 accent-primary"
              />
              Declaro cobertura vigente para todo el personal.
            </label>

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
    if (step === 1) return renderResponsableStep();
    if (stepThreeView === "seleccion") return renderSistemaSeleccionStep();
    if (stepThreeView === "planificacion") return renderPlanificacionStep();
    return renderArtStep();
  };

  const nextLabel =
    step === 2 && stepThreeView === "art"
      ? "Crear nueva obra"
      : step === 2 && stepThreeView === "planificacion"
        ? "Continuar"
        : "Siguiente";

  return (
    <div className="mx-auto w-full max-w-4xl pb-6">
      <Card className="overflow-hidden rounded-3xl border-slate-200 bg-[#F5F5F7] p-0">
        <header className="bg-secondary-plus px-8 py-5 text-white">
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

          <footer className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ChevronLeft size={16} className="mr-1" />
              Atras
            </Button>

            <Button type="button" onClick={handleNext} disabled={!canContinue}>
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
