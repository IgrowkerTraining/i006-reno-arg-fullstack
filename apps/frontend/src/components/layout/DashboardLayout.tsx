import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<LayoutProps> = () => {
   const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 p-6 overflow-auto">
         <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
