import { PlanningGroup, SistemaConstructivo } from "@/src/types";

export const PLANNING_GROUPS: PlanningGroup[] = [
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


export const SYSTEM_OPTIONS: Array<{
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
  

  export const FALLBACK_SYSTEM_IDS: Record<SistemaConstructivo, number> = {
    tradicional: 1,
    seco: 2,
    mixto: 3,
  };
  
  export const FALLBACK_TASK_IDS: Record<string, { stageId: number; taskId: number }> = {
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

  export const ART_PROVIDERS = [
    { id: "1", name: "Provincia ART" },
    { id: "2", name: "La Segunda ART" },
    { id: "3", name: "Prevencion ART" },
    { id: "4", name: "Swiss Medical ART" },
  ];


  export const STEPS = ["General", "Responsable", "Sistema y planificacion"];