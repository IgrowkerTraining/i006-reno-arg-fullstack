export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',

  MIS_OBRAS: 'mis-obras',
  MIS_OBRAS_NUEVA: 'mis-obras/nueva',
  OBRA_DETALLE: 'mis-obras/:obraId',
  OBRA_REGISTRO: 'mis-obras/:obraId/registro',
  OBRA_REGISTRO_SEGURIDAD: 'mis-obras/:obraId/registro/seguridad',
  OBRA_REGISTRO_FINALIZAR: 'mis-obras/:obraId/registro/finalizar',
  REPORTE_IA: 'reporte-ia',
  HOME: '/',
} as const;

export const ROUTE_BUILDERS = {
  obraDetalle: (obraId: string) => `/dashboard/mis-obras/${obraId}`,
  obraRegistro: (obraId: string) => `/dashboard/mis-obras/${obraId}/registro`,
  obraRegistroSeguridad: (obraId: string) =>
    `/dashboard/mis-obras/${obraId}/registro/seguridad`,
  obraRegistroFinalizar: (obraId: string) =>
    `/dashboard/mis-obras/${obraId}/registro/finalizar`,
} as const;

const API_BASE_URL =
  import.meta.env.VITE_URL_BASE ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

const NORMALIZED_API_BASE = API_BASE_URL.replace(/\/+$/, "").replace(/\/api$/, "");

export const API_ENDPOINTS = {
  BASE: NORMALIZED_API_BASE,
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  },
  HEALTH: '/api/health',
  USERS: {
    BASE: '/api/users',
    byId: (id: string | number) => `/api/users/${id}`,
  },
  PROJECTS: {
    BASE: '/api/projects',
    MY_PROJECTS: '/api/projects/my-projects',
    byId: (id: string | number) => `/api/projects/${id}`,
    updateArt: (id: string | number) => `/api/projects/${id}/art`,
  },
  CATALOG: {
    PLANNING: '/api/catalog/planning',
    REPORT: '/api/catalog/report',
  },
  STAGES: {
    byProject: (projectId: string | number) => `/api/stages/project/${projectId}`,
  },
  TASKS: {
    BASE: '/api/tasks',
    byStage: (stageId: string | number) => `/api/tasks/stage/${stageId}`,
  },
  REPORTS: {
    BASE: '/api/reports',
    byId: (id: string | number) => `/api/reports/${id}`,
    setup: (projectId: string | number) => `/api/reports/setup/${projectId}`,
  },
  ANALYSIS_IA: {
    generate: (projectId: string | number) =>
      `/api/analysis-ia/generate/${projectId}`,
  },
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
  },
  VALIDATIONS: {
    BASE: '/api/validations',
  },
} as const;

export const STORAGE_KEYS = {
  USER: 'example_user',
  TOKEN: 'example_token',
} as const;
