import { LayoutDashboard, ClipboardList, Settings, Flower } from "lucide-react";
import SidebarItem from "./SideBarItem";
import { useAuth } from "@/src/hooks/useAuth";


interface Props {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: Props) {

    const { user } = useAuth();

    return (
        <aside
            className={`bg-primary text-white h-full transition-all duration-300 ${collapsed ? "w-15" : " w-1/4 max-w-[200px] "
                } min-h-screen flex flex-col m-6 rounded-[36px] shadow-lg`}
        >
            {/* Logo */}
            <div className="flex flex-col p-4">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-blue-800 rounded"
                >
                    ☰
                </button>
                {!collapsed &&
                    <img src="/logo.svg" alt="Logo" className="h-50" />
                }

            </div>

            {/* Nav */}
            <nav className="mt-6 flex flex-col gap-2 px-2">
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
            <footer className={`mt-auto ${collapsed ? "p-1" : "p-4"} bg-secondary text-center text-xs text-gray-300 rounded-b-[36px]`}>
                <SidebarItem
                    icon={<span className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary text-sm font-bold">{user?.name?.charAt(0) || "U"}</span>}
                    label={<><p className="text-primary text-sm font-bold">{user?.name || "Usuario"}</p><p className="text-primary text-xs">SUPERVISOR</p></>}
                    collapsed={collapsed}
                />
            </footer>
        </aside>
    );
}
