import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Search } from "../common/Search";
import { Button } from "../common/Button";
import CardData from "./CardData";
import { ChartNoAxesCombined, ClockAlert, ListChecks, MapPin, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { getAIGreeting } from "@/src/services/service";
import { api, DashboardStats } from "@/src/services/api";
import { Card } from "../common/Card";
import { formatDate } from "@/src/utils/formateDate";
import { ROUTES } from "../../constants/routes";
import DropdownFilter from "./DropdownFilter";

const DATA = [
  { key: "activeProjects", icon: ChartNoAxesCombined, title: "Obras activas", color: "secondary" },
  { key: "artVigente", icon: ShieldCheck, title: "ART-vigente", color: "accent" },
  { key: "pendingTasks", icon: ClockAlert, title: "Tareas pendientes", color: "primary" },
  { key: "validatedProjects", icon: ListChecks, title: "Obras validadas", color: "accent-2" },
];

/* const DATAHistorialMarzo = [
  { title: "Ampliación planta alta - Local gastronómico", location: "San Isidro, CABA", workStage: "Obra gruesa", taks: "Levantamiento de tabiques", percent: "100%", date: "2026-03-10T00:00:00.000Z" }

];
const DATAHistorialFebrero = [
  { title: "Reforma vivienda unifamiliar", location: "Barrio Caballito, CABA", workStage: "Instalaciones", taks: "Eléctrica", percent: "75%", date: "2026-02-14T00:00:00.000Z" },
  { title: "Ampliación planta alta - Local gastronómico", location: "San Isidro, CABA", workStage: "Demolición y retiros", taks: "Picado de paredes, Retiro de abertura", percent: "100%", date: "2026-02-10T00:00:00.000Z" }
]; */
const DATAHistorial = [
  { id: 1, title: "Ampliación planta alta - Local gastronómico", location: "San Isidro, CABA", workStage: "Obra gruesa", taks: "Levantamiento de tabiques", percent: "100%", date: "2026-03-10T00:00:00.000Z" },
  { id: 2, title: "Reforma vivienda unifamiliar", location: "Barrio Caballito, CABA", workStage: "Instalaciones", taks: "Eléctrica", percent: "75%", date: "2026-02-14T00:00:00.000Z" },
  { id: 3, title: "Ampliación planta alta - Local gastronómico", location: "San Isidro, CABA", workStage: "Demolición y retiros", taks: "Picado de paredes, Retiro de abertura", percent: "100%", date: "2026-02-10T00:00:00.000Z" }
];


const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState<string>("Loading greeting...");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeProjects: 0,
    totalReports: 0,
    pendingTasks: 0,
    artVigente: "0%",
    validatedProjects: 0,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);


  const filteredHistorial = DATAHistorial.filter((item) => {
    const date = new Date(item.date);
    const monthMatch =
      selectedMonth !== null ? date.getMonth() === selectedMonth : true;
    const yearMatch =
      selectedYear !== null ? date.getFullYear() === selectedYear : true;

    return monthMatch && yearMatch;
  });

  const groupedByMonth = filteredHistorial.reduce((acc, item) => {
    const date = new Date(item.date);
    const month = date.toLocaleString("es-AR", { month: "long" });
    const year = date.getFullYear();
    const key = `${month} ${year}`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);

    return acc;
  }, {} as Record<string, typeof DATAHistorial>);

  const handleNewObraClick = () => {
    navigate(`${ROUTES.DASHBOARD}/${ROUTES.MIS_OBRAS_NUEVA}`);
  };

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const [msg, stats] = await Promise.all([
          getAIGreeting(user?.name || ""),
          api.getDashboardStats(),
        ]);
        setGreeting(msg);
        setDashboardStats(stats);
      } catch {
        const msg = await getAIGreeting(user?.name || "");
        setGreeting(msg);
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
        <Search placeholder="Buscar obra..." className={`mb-4 ${user?.idRol === 1 ? "lg:col-span-3" : "lg:col-span-4"}`} />
        {user?.idRol === 1 && (  <Button variant="secondary" onClick={handleNewObraClick} className="mb-4 lg:col-span-1">+ Nueva obra</Button>) }
      
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
            Object.entries(groupedByMonth).map(([monthLabel, items]) => (
              <div key={monthLabel}>
                <p className="text-lg text-primary font-bold mt-6 capitalize">
                  {monthLabel}
                </p>

                <ul className="space-y-3 mt-4 ml-10">
                  {items.map((item) => (
                    <React.Fragment key={item.id}>
                      <li >
                        <Link to={ROUTES.OBRA_DETALLE.replace(":obraId", item.id.toString())} className="grid grid-cols-4 items-end gap-5">

                          <div className="col-span-3 gap-3">
                            <p className="text-xs text-primary">
                              ETAPA {item.workStage.toUpperCase()}
                            </p>
                            <p className="text-[20px] font-bold">{item.taks}</p>
                            <p className="text-sm font-bold">{item.title}</p>
                            <p className="text-xs font-light">{item.location}</p>
                          </div>

                          <div className="col-span-1 text-right">
                            <p className="text-xs text-primary">
                              Avance total de obra
                            </p>
                            <p className="text-md font-bold text-primary">
                              {item.percent}
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
  );
}
export default Home;
