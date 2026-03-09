export interface User {
  id: string;
  email: string;
  lastName: string;
  name: string;
  avatar?: string;
  idRol: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export enum AuthView {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  DASHBOARD = "DASHBOARD",
}

//** Tipos relacionados a la creación de una nueva obra

export type SistemaConstructivo = "tradicional" | "seco" | "mixto";
export type StepThreeView = "seleccion" | "planificacion" | "art";

export interface NuevaObraForm {
  projectName: string;
  location: string;
  surface: string;
  managerName: string;
  licenseNumber: string;
  systemType: SistemaConstructivo;
  artProvider: string;
  artCoverageConfirmed: boolean;
}

export interface PlanningGroup {
  id: string;
  title: string;
  tasks: string[];
}

export interface PlanningCatalogTask {
  id: number;
  name: string;
}

export interface PlanningCatalogStage {
  id: number;
  name: string;
  tasks: PlanningCatalogTask[];
}

export interface PlanningCatalogResponse {
  systems: Array<{ id_system: number; name: string }>;
  planningStructure: PlanningCatalogStage[];
  artsCoverage: Array<{ id_art: number; name: string }>;
}

export interface DailyReport {
  id: number;
  date: string;
  project_name: string;
  supervisor: string;
  progress_percentage: string;
  comment: string;
  validation_status: "PENDIENTE" | "APROBADO";
}
