export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  MIS_OBRAS: '/mis-obras',
  MIS_OBRAS_NUEVA: '/mis-obras/nueva',
  OBRA_DETALLE: '/mis-obras/:obraId',
  OBRA_REGISTRO: '/mis-obras/:obraId/registro',
  OBRA_REGISTRO_SEGURIDAD: '/mis-obras/:obraId/registro/seguridad',
  OBRA_REGISTRO_FINALIZAR: '/mis-obras/:obraId/registro/finalizar',
  REPORTE_IA: '/reporte-ia',
  PROFILE: '/profile',
  HOME: '/',
} as const;

export const ROUTE_BUILDERS = {
  obraDetalle: (obraId: string) => `/mis-obras/${obraId}`,
  obraRegistro: (obraId: string) => `/mis-obras/${obraId}/registro`,
  obraRegistroSeguridad: (obraId: string) =>
    `/mis-obras/${obraId}/registro/seguridad`,
  obraRegistroFinalizar: (obraId: string) =>
    `/mis-obras/${obraId}/registro/finalizar`,
} as const;

export const API_ENDPOINTS = {
  BASE: import.meta.env.VITE_URL_BASE,
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  HEALTH: '/health',
} as const;

export const STORAGE_KEYS = {
  USER: 'example_user',
  TOKEN: 'example_token',
} as const;
