import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const finalCollapsed = isMobile ? true : collapsed;

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={finalCollapsed} setCollapsed={setCollapsed} isMobile={isMobile} />
      <main className="flex-1 overflow-auto min-h-screen pt-6 pr-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;