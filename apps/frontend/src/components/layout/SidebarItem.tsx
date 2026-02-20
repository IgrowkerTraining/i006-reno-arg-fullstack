import React from 'react';

interface Props {
  icon: React.ReactNode;
  label: React.ReactNode;
  collapsed: boolean;
}

export default function SidebarItem({ icon, label, collapsed }: Props) {
  return (
    <div className="relative group">
      <div className="flex items-center gap-3 p-3 
                      hover:bg-accent hover:text-primary 
                      cursor-pointer transition-colors rounded-full">
        {icon}
        {!collapsed && <span className="text-md text-left">{label}</span>}
      </div>

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