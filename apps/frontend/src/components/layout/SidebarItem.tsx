import React from 'react';

interface Props {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

export default function SidebarItem({ icon, label, collapsed }: Props) {
  return (
    <div className="flex items-center gap-3 p-3 rounded hover:bg-blue-800 cursor-pointer transition-colors">
      {icon}
      {!collapsed && <span className="text-md text-left">{label}</span>}
    </div>
  );
}
