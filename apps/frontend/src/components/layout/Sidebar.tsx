import { LayoutDashboard, ClipboardList, Settings, Flower, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useAuth } from "@/src/hooks/useAuth";


interface Props {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: Props) {

    const { user } = useAuth();

    return (
        <aside
            className={`bg-primary text-white transition-all duration-300 ${collapsed ? "w-[60px]" : "w-1/4 max-w-[260px]"
                } flex flex-col m-6 rounded-[36px] shadow-lg overflow-visible`}
        >
            {/* Logo */}
            <div className={`flex flex-col mt-5 gap-5 text-accent  ${collapsed ? "items-center p-2 " : "items-end p-4.5"} transition-all duration-300`}>


                {collapsed ? (
                    <PanelLeftOpen size={20} className="" onClick={() => setCollapsed(!collapsed)} />
                ) : (
                    <PanelLeftClose size={20} className="cursor-pointer text-accent" onClick={() => setCollapsed(!collapsed)} />
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
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<ClipboardList size={20} />}
                    label="Mis obras"
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<Flower size={20} />}
                    label="Reporte IA"
                    collapsed={collapsed}
                />
            </nav>
            <footer className={`mt-auto ${collapsed ? "px-2 py-4" : "p-4"} bg-secondary text-center text-xs text-gray-300 rounded-b-[36px]`}>
                <div className={`flex flex-row items-center gap-4  mb-2 ${collapsed ? "justify-center" : "justify-start"}`}>
                    <span className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary text-sm font-bold">
                        {user?.name?.charAt(0) || "U"}
                    </span>
                {!collapsed && (
                    <div className="flex flex-col items-start"> 
                    <p className="text-primary text-sm font-bold">
                        {user?.name || "Usuario"}
                    </p>
                        <p className="text-primary text-xs">SUPERVISOR</p>
                    </div>
                )}
                </div>
            </footer>
        </aside>
    );
}
