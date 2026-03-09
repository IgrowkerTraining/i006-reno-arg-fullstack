import { API_ENDPOINTS } from "../constants/routes";
import { User } from "../types";
import { storage } from "../utils/storage";

interface ApiErrorPayload {
  error?: string;
  message?: string;
}

export interface DashboardStats {
  activeProjects: number;
  totalReports: number;
  pendingTasks: number;
  artVigente: string;
  validatedProjects: number;
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
  safetyItems: Array<{ id_medida_seg: number; cumple: boolean }>;
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

  const response = await request<{ success: boolean; data: any[] }>(endpoint, {}, true);
  return response.data;
},

  async getMyProjects(): Promise<any[]> {
  const response = await request<{ success: boolean; data: any[] }>(API_ENDPOINTS.PROJECTS.MY_PROJECTS, {}, true);
  return response.data;
  },
  async getProjectById(projectId: string | number): Promise<any> {
    return request<any>(API_ENDPOINTS.PROJECTS.byId(projectId), {}, true);
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
    return request<any[]>(API_ENDPOINTS.REPORTS.BASE);
  },

  async getReportById(reportId: string | number): Promise<any> {
    return request<any>(API_ENDPOINTS.REPORTS.byId(reportId));
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
    return request<any>(API_ENDPOINTS.ANALYSIS_IA.generate(projectId), {
      method: "POST",
      body: JSON.stringify({ month, year }),
    });
  },

   async getIAReportsByProjectId(projectId: string | number): Promise<any> {
    return request<any>(API_ENDPOINTS.ANALYSIS_IA.history(projectId));
  },

  async getValidations(): Promise<any[]> {
    return request<any[]>(API_ENDPOINTS.VALIDATIONS.BASE);
  },
};
