import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useMatch } from "react-router-dom";

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
const matchReporteIA = useMatch("/dashboard/reporte-ia/*");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const finalCollapsed = isMobile ? true : collapsed;
  

  return (
    <div className={`flex min-h-screen ${matchReporteIA ? "bg-[#EEF8FA]" : ""} overflow-hidden`}>
      <Sidebar collapsed={finalCollapsed} setCollapsed={setCollapsed} isMobile={isMobile} />
      <main className="flex-1 overflow-auto p-6 lg:pr-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;