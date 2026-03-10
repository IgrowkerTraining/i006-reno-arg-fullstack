import { API_ENDPOINTS } from "../constants/routes";
import { User } from "../types";
import { storage } from "../utils/storage";

interface ApiErrorPayload {
  error?: string;
  message?: string;
}

interface ApiListResponse<T> {
  success?: boolean;
  count?: number;
  data?: T[];
}

interface ApiDataResponse<T> {
  success?: boolean;
  data?: T;
}

export interface DashboardStats {
  activeProjects: number;
  totalReports: number;
  pendingTasks: number;
  artVigente: string;
  validatedProjects: number;
}

export interface ProjectFullDetailResponse {
  id_proyecto: number;
  codigo: string;
  nombre: string;
  ubicacion: string;
  superficie_m2: number;
  fecha_registro: string;
  responsable_nombre: string;
  responsable_matricula: string | null;
  sistema_constructivo: string | null;
  art_entidad: string | null;
  etapas: Array<{
    id_etapa: number;
    etapa_nombre: string;
    progreso: number;
    id_estado: number;
    estado_nombre: string;
    tareas: Array<{
      id_tarea: number;
      tarea_nombre: string;
      tarea_id_estado: number;
      tarea_estado_nombre: string;
    }>;
  }>;
  historial_reciente: Array<{
    id_registro_avance: number;
    fecha: string;
    supervisor_nombre: string;
    estado_validacion: string;
  }>;
}

export interface AnalysisRecord {
  id: number;
  projectId: number;
  createdAt: string;
  content: Record<string, unknown>;
}

export interface UserProfile {
  id: string | number;
  name: string;
  lastName: string;
  email: string;
  idRol: number;
  role?: string;
  licenseNo?: string | null;
}

export interface ReportTaskDetail {
  task_name: string;
  task_status: string;
}

export interface ReportTradeDetail {
  trade_name: string;
}

export interface ReportSafetyDetail {
  safety_description: string;
  status: boolean;
}

export interface ReportDetail {
  reportId: number;
  supervisorId: number;
  projectId: number;
  date: string;
  progressPercentage: number;
  comment: string;
  projectName: string;
  supervisorName: string;
  validationStatus: string | null;
  technicalComment: string | null;
  tasks: ReportTaskDetail[];
  trades: ReportTradeDetail[];
  safety: ReportSafetyDetail[];
}

interface CatalogSystem {
  id_system: number;
  name: string;
}

interface CatalogTask {
  id: number;
  name: string;
}

interface CatalogPlanningStage {
  id: number;
  name: string;
  tasks: CatalogTask[];
}

interface ArtCoverageCatalog {
  id_art: number;
  name: string;
}

interface PlanningCatalogResponse {
  systems: CatalogSystem[];
  planningStructure: CatalogPlanningStage[];
  artsCoverage: ArtCoverageCatalog[];
}

interface ReportCatalogResponse {
  trades: Array<{ id_trade: number; name: string }>;
  safetyMeasures: Array<{ id_safety_measure: number; name: string }>;
}

interface StagePayload {
  id_tipo_etapa: number;
  fecha_inicio: string;
  tareas: number[];
}

export interface CreateProjectPayload {
  nombre: string;
  ubicacion: string;
  superficie_m2: number;
  id_responsable: number;
  id_sistema_constructivo: number;
  matricula_responsable: string;
  id_art?: number | null;
  etapas: StagePayload[];
}

export interface CreateDailyReportPayload {
  idSupervisor: number;
  idProject: number;
  progressPercentage: number;
  comment: string;
  selectedTasks: number[];
  selectedTrades: number[];
  safetyItems: Array<{ id: number; status: boolean }>;
}

const getAuthToken = () => storage.getToken() || localStorage.getItem("token");

const buildUrl = (endpoint: string) => `${API_ENDPOINTS.BASE}${endpoint}`;

const parseResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | null;
    throw new Error(
      errorPayload?.error ||
        errorPayload?.message ||
        `Request failed (${response.status})`,
    );
  }

  return payload as T;
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false,
): Promise<T> => {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormDataBody = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (hasBody && !isFormDataBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildUrl(endpoint), {
    ...options,
    headers,
  });

  return parseResponse<T>(response);
};

const unwrapListResponse = <T>(payload: ApiListResponse<T> | T[] | null | undefined): T[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

const unwrapDataResponse = <T>(payload: ApiDataResponse<T> | T | null | undefined): T | null => {
  if (!payload) return null;
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as ApiDataResponse<T>).data ?? null;
  }
  return payload as T;
};

export const api = {
  async register(data: { name: string; email: string; password: string }): Promise<{ user: User; message: string }> {
    return request<{ user: User; message: string }>(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }): Promise<{ user: User; token: string; message: string }> {
    const result = await request<{ user: User; token: string; message: string }>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    if (result.token) {
      storage.setToken(result.token);
      localStorage.setItem("token", result.token);
    }

    return result;
  },

  async checkHealth(): Promise<boolean> {
    try {
      await request<{ status: string }>(API_ENDPOINTS.HEALTH);
      return true;
    } catch {
      return false;
    }
  },

  async getDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS);
  },

  async getProjects(name?: string): Promise<any[]> {
    const endpoint = name
      ? `${API_ENDPOINTS.PROJECTS.BASE}?name=${encodeURIComponent(name)}`
      : API_ENDPOINTS.PROJECTS.BASE;

    const response = await request<ApiListResponse<any>>(endpoint, {}, true);
    return unwrapListResponse(response);
  },

  async getMyProjects(): Promise<any[]> {
    const response = await request<ApiListResponse<any>>(
      API_ENDPOINTS.PROJECTS.MY_PROJECTS,
      {},
      true,
    );
    return unwrapListResponse(response);
  },

  async getProjectById(projectId: string | number): Promise<any> {
    return request<any>(API_ENDPOINTS.PROJECTS.byId(projectId), {}, true);
  },

  async getUserById(userId: string | number): Promise<UserProfile> {
    return request<UserProfile>(API_ENDPOINTS.USERS.byId(userId), {}, true);
  },

  async getProjectFullDetail(projectId: string | number): Promise<ProjectFullDetailResponse | null> {
    const response = await request<ApiDataResponse<ProjectFullDetailResponse>>(
      API_ENDPOINTS.PROJECTS.detail(projectId),
      {},
      true,
    );
    return unwrapDataResponse<ProjectFullDetailResponse>(response);
  },

  async createProject(data: CreateProjectPayload): Promise<any> {
    return request<any>(
      API_ENDPOINTS.PROJECTS.BASE,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      true,
    );
  },

  async updateProjectArt(projectId: string | number, artCoverageId: number): Promise<any> {
    return request<any>(
      API_ENDPOINTS.PROJECTS.updateArt(projectId),
      {
        method: "PATCH",
        body: JSON.stringify({ artCoverageId }),
      },
      true,
    );
  },

  async getPlanningCatalog(): Promise<PlanningCatalogResponse> {
    return request<PlanningCatalogResponse>(API_ENDPOINTS.CATALOG.PLANNING);
  },

  async getReportCatalog(): Promise<ReportCatalogResponse> {
    return request<ReportCatalogResponse>(API_ENDPOINTS.CATALOG.REPORT);
  },

  async getReportSetup(projectId: string | number): Promise<any> {
    return request<any>(API_ENDPOINTS.REPORTS.setup(projectId));
  },

  async getReports(): Promise<any[]> {
    const response = await request<ApiListResponse<any> | any[]>(
      API_ENDPOINTS.REPORTS.BASE,
      {},
      true,
    );
    return unwrapListResponse(response as ApiListResponse<any> | any[]);
  },

  async getReportById(reportId: string | number): Promise<ReportDetail | null> {
    const response = await request<ApiDataResponse<ReportDetail>>(
      API_ENDPOINTS.REPORTS.byId(reportId),
      {},
      true,
    );
    return unwrapDataResponse(response);
  },

  async getReportsByProject(projectId: string | number): Promise<any[]> {
    const response = await request<ApiListResponse<any>>(
      API_ENDPOINTS.REPORTS.byProject(projectId),
      {},
      true,
    );
    return unwrapListResponse(response);
  },

  async getReportByProjectId(projectId: string | number): Promise<any> {
    return request<any>(API_ENDPOINTS.REPORTS.project(projectId));
  },

  async createDailyReport(data: CreateDailyReportPayload): Promise<any> {
    return request<any>(API_ENDPOINTS.REPORTS.BASE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async generateAnalysis(projectId: string | number, month: number, year: number): Promise<any> {
    const response = await request<ApiDataResponse<any>>(
      API_ENDPOINTS.ANALYSIS_IA.generate(projectId),
      {
      method: "POST",
      body: JSON.stringify({ month, year }),
      },
      true,
    );

    return unwrapDataResponse<any>(response);
  },

  async getAnalysisHistory(projectId: string | number): Promise<AnalysisRecord[]> {
    const response = await request<ApiListResponse<AnalysisRecord>>(
      API_ENDPOINTS.ANALYSIS_IA.history(projectId),
      {},
      true,
    );
    return unwrapListResponse(response);
  },

  async getAllAnalyses(): Promise<AnalysisRecord[]> {
    const response = await request<ApiListResponse<AnalysisRecord>>(
      API_ENDPOINTS.ANALYSIS_IA.BASE,
      {},
      true,
    );
    return unwrapListResponse(response);
  },

  async getAnalysisById(id: string | number): Promise<AnalysisRecord | null> {
    const response = await request<ApiDataResponse<AnalysisRecord>>(
      API_ENDPOINTS.ANALYSIS_IA.byId(id),
      {},
      true,
    );
    return unwrapDataResponse(response);
  },

   async getIAReportsByProjectId(projectId: string | number): Promise<any> {
    return request<any>(API_ENDPOINTS.ANALYSIS_IA.history(projectId));
  },

  async getValidations(): Promise<any[]> {
    const response = await request<ApiListResponse<any> | any[]>(
      API_ENDPOINTS.VALIDATIONS.BASE,
      {},
      true,
    );
    return unwrapListResponse(response as ApiListResponse<any> | any[]);
  },

  async updateValidation(
    id: string | number,
    payload: { status: string; observations?: string },
  ): Promise<any> {
    return request<any>(
      API_ENDPOINTS.VALIDATIONS.byId(id),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      true,
    );
  },
};
