import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Search } from "../common/Search";
import { Button } from "../common/Button";
import CardData from "./CardData";
import { ChartNoAxesCombined, ClockAlert, ListChecks, MapPin, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { getAIGreeting } from "@/src/services/service";
import { api } from "@/src/services/api";
import { Card } from "../common/Card";
import { formatDate } from "@/src/utils/formateDate";
import { ROUTES } from "../../constants/routes";

const DATA = [
  { icon: ChartNoAxesCombined, title: "Obras activas", data: "4", color: "secondary" },
  { icon: ShieldCheck, title: "ART-vigente", data: "100%", color: "primary" },
  { icon: ClockAlert, title: "Tareas pendientes", data: "12", color: "accent" },
  { icon: ListChecks, title: "Obras validadas", data: "3", color: "secondary" },
];

const DATAHistorialMarzo = [
  { title: "Ampliación planta alta - Local gastronómico", location: "San Isidro, CABA", percent: "100%", date: "2026-03-10T00:00:00.000Z" }

];
const DATAHistorialFebrero = [
  { title: "Reforma vivienda unifamiliar", location: "Barrio Caballito, CABA", percent: "75%", date: "2026-02-04T00:00:00.000Z" },
  { title: "Local comercial - Gastronomía", location: "Palermo Soho, CABA", percent: "50%", date: "2026-02-25T00:00:00.000Z" },
];


const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState<string>("Loading greeting...");

  const handleNewObraClick = () => {
    navigate(`${ROUTES.DASHBOARD}/${ROUTES.MIS_OBRAS_NUEVA}`);
  };

  useEffect(() => {
    const initDashboard = async () => {
      const [msg] = await Promise.all([
        getAIGreeting(user?.name || ""),
        api.checkHealth(),
      ]);
      setGreeting(msg);
    };
    initDashboard();
  }, [user?.name]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:gap-14 md:grid-cols-2 lg:grid-cols-4">
        <Search placeholder="Buscar obra..." className="mb-4 lg:col-span-3" />
        <Button variant="secondary" onClick={handleNewObraClick} className="mb-4 lg:col-span-1">+ Nueva obra</Button>
      </div>
      <h1 className="text-2xl font-bold mt-5">{greeting}</h1>
      <section className="mt-8 grid grid-cols-1 gap-4 lg:gap-14 md:grid-cols-2 lg:grid-cols-4">
        {DATA.map((item) => (
          <CardData key={item.title} icon={item.icon} title={item.title} data={item.data} color={item.color} />
        ))}
      </section>
      <Card className="mt-8 p-6 border-neutro-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Historial de registros diarios</h2>
          <SlidersHorizontal className="text-primary" />
        </div>
       
        <hr className="border-neutro-2" />
        <p className="text-lg text-primary font-bold mt-6">Marzo</p>
        <ul className="space-y-3 mt-4">
          {DATAHistorialMarzo.map((item, index) => (
            <li key={index} className="grid grid-cols-4 items-center gap-5">
              <div className="col-span-3 gap-3 flex items-center">
                <MapPin className="text-primary" />
                <div><p className="text-md font-medium">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.location}</p></div>
              </div>
              <div className="col-span-1">
                <p className="text-md font-bold text-primary">{item.percent}</p>
                <p className="text-sm text-slate-500">{formatDate(item.date)}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-lg text-primary font-bold mt-6">Febrero</p>
        <ul className="space-y-3 mt-4">
          {DATAHistorialFebrero.map((item, index) => (
            <li key={index} className="grid grid-cols-4 items-center gap-5">
              <div className="col-span-3 gap-3 flex items-center">
                <MapPin className="text-primary" />
                <div><p className="text-md font-medium">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.location}</p></div>
              </div>
              <div className="col-span-1">
                <p className="text-md font-bold text-primary">{item.percent}</p>
                <p className="text-sm text-slate-500">{formatDate(item.date)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

    </>
  );
}
export default Home;
