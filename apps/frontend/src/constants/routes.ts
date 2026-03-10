export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',

  MIS_OBRAS: 'mis-obras',
  MIS_OBRAS_NUEVA: 'mis-obras/nueva',
  OBRA_DETALLE: 'mis-obras/:obraId',
  OBRA_REGISTRO_DETALLE: 'mis-obras/:obraId/registros/:registroId',
  OBRA_REGISTRO: 'mis-obras/:obraId/registro',
  OBRA_REGISTRO_SEGURIDAD: 'mis-obras/:obraId/registro/seguridad',
  OBRA_REGISTRO_FINALIZAR: 'mis-obras/:obraId/registro/finalizar',
  REPORTE_IA: 'reporte-ia',
  REPORTE_IA_OBRA: 'reporte-ia/:obraId',
  REPORTE_IA_OBRA_HISTORIAL: 'reporte-ia/:obraId/historial',
  HOME: '/',
} as const;

export const ROUTE_BUILDERS = {
  obraDetalle: (obraId: string) => `/dashboard/mis-obras/${obraId}`,
  obraRegistroDetalle: (obraId: string, registroId: string) =>
    `/dashboard/mis-obras/${obraId}/registros/${registroId}`,
  obraRegistro: (obraId: string) => `/dashboard/mis-obras/${obraId}/registro`,
  obraRegistroSeguridad: (obraId: string) =>
    `/dashboard/mis-obras/${obraId}/registro/seguridad`,
  obraRegistroFinalizar: (obraId: string) =>
    `/dashboard/mis-obras/${obraId}/registro/finalizar`,
  reporteIAObra: (obraId: string | number) =>
  `/dashboard/reporte-ia/${obraId}`,
   reporteIAObraHistorial: (obraId: string | number) =>
  `/dashboard/reporte-ia/${obraId}/historial`,
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
    detail: (projectId: string | number) => `/api/projects/${projectId}/detail`,
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
    byProject: (projectId: string | number) => `/api/reports/project/${projectId}`,
    setup: (projectId: string | number) => `/api/reports/setup/${projectId}`,
    project: (projectId: string | number) => `/api/reports/project/${projectId}`,
  },
  ANALYSIS_IA: {
    BASE: '/api/analysis-ia',
    generate: (projectId: string | number) =>
      `/api/analysis-ia/generate/${projectId}`,
    history: (projectId: string | number) =>
      `/api/analysis-ia/history/${projectId}`,
    byId: (id: string | number) => `/api/analysis-ia/${id}`,
  },
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
  },
  VALIDATIONS: {
    BASE: '/api/validations',
    byId: (id: string | number) => `/api/validations/${id}`,
  },
} as const;

export const STORAGE_KEYS = {
  USER: 'example_user',
  TOKEN: 'example_token',
} as const;
