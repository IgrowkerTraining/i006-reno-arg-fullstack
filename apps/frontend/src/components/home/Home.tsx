import React, { useRef, useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Search } from "../common/Search";
import { Button } from "../common/Button";
import CardData from "./CardData";
import { ChartNoAxesCombined, ClockAlert, ListChecks, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { getAIGreeting } from "@/src/services/service";
import { api, DashboardStats } from "@/src/services/api";
import { Card } from "../common/Card";
import { formatDate } from "@/src/utils/formateDate";
import { ROUTE_BUILDERS, ROUTES } from "../../constants/routes";
import DropdownFilter from "./DropdownFilter";
import { DailyReport } from "@/src/types";
import { useDebounce } from "@/src/hooks/useDebounced";

const DATA = [
  { key: "activeProjects", icon: ChartNoAxesCombined, title: "Obras activas", color: "secondary" },
  { key: "artVigente", icon: ShieldCheck, title: "ART-vigente", color: "accent" },
  { key: "pendingTasks", icon: ClockAlert, title: "Tareas pendientes", color: "primary" },
  { key: "validatedProjects", icon: ListChecks, title: "Registros validados", color: "accent-2" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState<string>("Cargando saludo...");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeProjects: 0,
    totalReports: 0,
    pendingTasks: 0,
    artVigente: "0%",
    validatedProjects: 0,
  });
  const [reports, setReports] = useState<DailyReport[]>([])

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 300)

  const resolveProjectId = async (item: DailyReport): Promise<string | null> => {
    const rawProjectId = item.project_id ?? item.projectId;
    if (rawProjectId) {
      return String(rawProjectId);
    }

    const reportDetail = await api.getReportById(item.id);
    const detailProjectId = (reportDetail as any)?.projectId ?? (reportDetail as any)?.projectid;
    return detailProjectId ? String(detailProjectId) : null;
  };

  const handleHistoryClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: DailyReport,
  ) => {
    event.preventDefault();

    try {
      const projectId = await resolveProjectId(item);
      if (!projectId) return;

      navigate(ROUTE_BUILDERS.obraRegistroDetalle(projectId, String(item.id)));
    } catch (error) {
      console.error("No se pudo abrir el detalle del registro:", error);
    }
  };

  const getHistoryLink = (item: DailyReport): string => {
    const directProjectId = item.project_id ?? item.projectId;
    return directProjectId
      ? ROUTE_BUILDERS.obraRegistroDetalle(String(directProjectId), String(item.id))
      : ROUTES.DASHBOARD;
  };


  const filteredHistorial = useMemo(() => {
    return [...reports]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .filter((item) => {
        const date = new Date(item.date)

        const monthMatch =
          selectedMonth !== null
            ? date.getMonth() === selectedMonth
            : true

        const yearMatch =
          selectedYear !== null
            ? date.getFullYear() === selectedYear
            : true

        const searchMatch = Object.values(item).some((value) =>
          String(value).toLowerCase().includes(debouncedSearch.toLowerCase())
        )

        return monthMatch && yearMatch && searchMatch
      })
  }, [reports, selectedMonth, selectedYear, debouncedSearch])

  const groupedByMonth = useMemo(() => {
    return filteredHistorial.reduce(
      (acc: Record<string, DailyReport[]>, item) => {
        const date = new Date(item.date)
        const month = date.toLocaleString("es-AR", {
          month: "long",
        })
        const year = date.getFullYear()
        const key = `${month} ${year}`

        if (!acc[key]) acc[key] = []
        acc[key].push(item)
        return acc
      },
      {}
    )
  }, [filteredHistorial])

  const handleNewObraClick = () => {
    navigate(`${ROUTES.DASHBOARD}/${ROUTES.MIS_OBRAS_NUEVA}`);
  };

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const [msg, stats, reports] = await Promise.all([
          getAIGreeting(user?.name || ""),
          api.getDashboardStats(),
          api.getReports()
        ]);
        setGreeting(msg);
        setDashboardStats(stats);
        setReports(reports)

      } catch (error) {
        const msg = await getAIGreeting(user?.name || "");
        setGreeting(msg);
        console.error("Error cargando reportes:", error)
      }
    };
    initDashboard();
  }, [user?.name]);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasResults = Object.keys(groupedByMonth).length > 0;


  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:gap-14 md:grid-cols-2 lg:grid-cols-4">
        <Search
          placeholder="Buscar obra..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`mb-4 ${user?.idRol === 1 ? "lg:col-span-3" : "lg:col-span-4"}`} />
        {user?.idRol === 1 && (<Button variant="secondary" onClick={handleNewObraClick} className="mb-4 lg:col-span-1">+ Nueva obra</Button>)}

      </div>
      <h1 className="text-2xl font-bold mt-5">{greeting}</h1>
      <section className="mt-8 grid grid-cols-1 gap-4 lg:gap-14 md:grid-cols-2 lg:grid-cols-4">
        {DATA.map((item) => (
          <CardData
            key={item.title}
            icon={item.icon}
            title={item.title}
            data={String(dashboardStats[item.key as keyof DashboardStats])}
            color={item.color as "primary" | "secondary" | "accent" | "accent-2"}
          />
        ))}
      </section>
      <Card className="mt-8 py-6 px-10 border-neutro-3 h-[400px] flex flex-col overflow-hidden " >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-primary">Historial de registros diarios</h2>
          <div ref={filterRef} className="relative">
            <SlidersHorizontal className="text-primary cursor-pointer" onClick={() => setIsFilterOpen((prev) => !prev)} />
            {isFilterOpen && (
              <DropdownFilter setSelectedMonth={setSelectedMonth} setSelectedYear={setSelectedYear} />
            )}
          </div>
        </div>
        <hr className="border-neutro-2" />

        <div className="flex-1 overflow-y-auto pr-6">
          {hasResults ? (
            (Object.entries(groupedByMonth) as [string, DailyReport[]][])
              .map(([monthLabel, items]) => (
                <div key={monthLabel}>
                  <p className="text-lg text-primary font-bold mt-6 capitalize">
                    {monthLabel}
                  </p>

                  <ul className="space-y-3 mt-4 ml-10">
                    {items.map((item) => (
                      <React.Fragment key={item.id}>
                        <li >
                          <Link
                            to={getHistoryLink(item)}
                            onClick={(event) => void handleHistoryClick(event, item)}
                            className="grid grid-cols-4 items-end gap-5"
                          >
                            <div className="col-span-3 gap-3">
                               <p className="text-xs text-primary">
                              ETAPA {item.stage_name}
                            </p>
                              <p className="text-[20px] font-bold">{item.comment}</p>
                              <p className="text-sm font-bold">{item.project_name}</p>
                              <p className="text-xs font-light">{item.address_project}</p>
                            </div>

                            <div className="col-span-1 text-right">
                              <span className={`text-xs ${item.validation_status === "PENDIENTE" ? "text-accent-2" : "text-secondary-plus"} ml-4`}>&bull; {item.validation_status}</span>
                              <p className="text-xs text-primary">
                                Avance total de obra
                              </p>
                              <p className="text-md font-bold text-primary">
                                {Math.round(Number(item.progress_percentage))}%
                              </p>
                              <p className="text-xs text-slate-500">
                                Fecha de registro: {formatDate(item.date)}
                              </p>
                            </div>
                          </Link>
                        </li>

                        <hr className="border-neutro-2" />
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              ))
          ) : (
            <div className="mt-6 text-neutro-2">
              <p className="text-lg font-semibold">
                No hay resultados para mostrar
              </p>
            </div>
          )}
        </div>
      </Card>

    </>
  )
}
export default Home;
