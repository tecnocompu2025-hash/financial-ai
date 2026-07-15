import { BarChart3, CreditCard, Landmark, LayoutDashboard, LogOut, Target, TrendingUp, Wallet, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const groups = [
  { title: "RESUMEN", items: [[LayoutDashboard, "Dashboard", "/"], [BarChart3, "Reportes", "/reports"]] },
  { title: "FLUJO DE CAJA", items: [[Wallet, "Ingresos", "/income"], [CreditCard, "Gastos", "/expense"], [Landmark, "Pagos pendientes", "/payments"]] },
  { title: "CONSTRUYE RIQUEZA", items: [[TrendingUp, "Activos", "/assets"], [Target, "Metas", "/goals"]] },
  { title: "DEUDAS Y CRÉDITOS", items: [[Landmark, "Deudas", "/debts"], [Landmark, "Editar créditos", "/credit-edit"]] },
] as const;

export default function SidebarV2({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800/60 bg-slate-900/80 backdrop-blur-xl">
      {/* Brand */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Financial AI</h1>
            <p className="text-xs text-slate-400">Tu libertad financiera</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        {groups.map((group) => (
          <section key={group.title} className="mb-6">
            <p className="mb-2 px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map(([Icon, label, path]) => {
                const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
                return (
                  <button 
                    key={label} 
                    onClick={() => navigate(path)} 
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? "bg-indigo-500/10 text-indigo-400" 
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    )}
                    <Icon size={18} className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-slate-300"}`} />
                    {label}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      {/* Footer / User Area */}
      <div className="border-t border-slate-800/60 p-4">
        <div className="mb-4 flex items-center justify-between px-4">
          <span className="text-sm font-semibold text-white">{userName}</span>
          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-300">PRO</span>
        </div>
        <button onClick={() => navigate("/settings")} className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-slate-200">
          <Settings size={18} />
          Configuración
        </button>
        <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300">
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
