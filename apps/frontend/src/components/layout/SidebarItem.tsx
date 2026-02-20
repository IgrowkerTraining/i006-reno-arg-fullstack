import React from 'react';
import { NavLink } from "react-router-dom";

interface Props {
  icon: React.ReactNode;
  label: React.ReactNode;
  collapsed: boolean;
  link: string;
  end?: boolean;
}


export default function SidebarItem({ icon, label, collapsed, link, end }: Props) {
  return (
    <div className="relative group">
      <NavLink
        to={link}
        end={end}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-full transition-colors
           hover:bg-accent hover:text-primary
           ${isActive ? "bg-accent text-primary" : ""}`
        }
      >
        {icon}
        {!collapsed && <span className="text-md text-left">{label}</span>}
      </NavLink>

      {collapsed && (
        <div
          className="
            absolute left-full ml-4 top-1/2 -translate-y-1/2
            bg-neutro-1 text-white text-xs px-3 py-2
            rounded-xl shadow-xl
            opacity-0 group-hover:opacity-100
            translate-x-[-5px] group-hover:translate-x-0
            transition-all duration-200
            whitespace-nowrap pointer-events-none
          "
        >
          {label}
        </div>
      )}
    </div>
  );
}