import { LayoutDashboard, ClipboardList, Flower, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useAuth } from "@/src/hooks/useAuth";
import { Link } from "react-router-dom";


interface Props {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
    isMobile: boolean;
}

export default function Sidebar({ collapsed, setCollapsed, isMobile }: Props) {

    const { user } = useAuth();
    
    return (
        <aside
            className={`bg-primary text-white transition-all duration-300 ${collapsed ? "w-15" : "w-1/6 max-w-65"
                } flex flex-col m-6 rounded-[36px] shadow-lg overflow-visible`}
        >
            <div className={`flex flex-col mt-5 gap-5 text-accent  ${collapsed ? "items-center p-2 " : "items-end p-4.5"} transition-all duration-300`}>

                {!isMobile && (
                    collapsed ? (
                        <PanelLeftOpen
                            size={20}
                            className="cursor-pointer"
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    ) : (
                        <PanelLeftClose
                            size={20}
                            className="cursor-pointer text-accent"
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    )
                )}

                {collapsed ?
                    <img src="/iso.svg" alt="Logo" className="w-20" /> : <img src="/logo.svg" alt="Logo" className="w-full" />
                }

            </div>

            {/* Nav */}
            <nav className={`mt-6 flex flex-col gap-2  ${collapsed ? "px-2" : "px-4"}`}>
                <SidebarItem
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    link="/dashboard"
                    end
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<ClipboardList size={20} />}
                    label="Mis obras"
                    link="/dashboard/mis-obras"
                    collapsed={collapsed}
                />
                {user?.idRol === 1 &&
                    <SidebarItem
                        icon={<Flower size={20} />}
                        label="Reporte IA"
                        link="/dashboard/reporte-ia"
                        collapsed={collapsed}
                    />}
            </nav>
            {/* Footer con info del usuario */}
            <footer className={`mt-auto ${collapsed ? "px-2 py-4" : "p-4"} bg-secondary text-center text-xs text-gray-300 rounded-b-[36px]`}>
                <Link to="/dashboard/profile" className={`flex flex-row items-center gap-4  mb-2 ${collapsed ? "justify-center" : "justify-start"}`}>
                    <span className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary text-sm font-bold">
                        {user?.name && user.lastName ? `${user.name.charAt(0)}${user.lastName.charAt(0)}` : "U"}
                    </span>
                    {!collapsed && (
                        <div className="flex flex-col items-start">
                            <p className="text-primary text-sm font-bold">
                                {user?.name && user.lastName ? `${user.name} ${user.lastName}` : "Usuario"}
                            </p>
                            <p className="text-primary text-xs">{user?.idRol === 1 ? 'Arquitecto' : 'Supervisor'}</p>
                        </div>
                    )}
                </Link>
            </footer>
        </aside>
    );
}
