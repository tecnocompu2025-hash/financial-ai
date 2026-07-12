import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  TrendingUp,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Landmark,
} from "lucide-react";

const menu = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Wallet, label: "Ingresos" },
  { icon: CreditCard, label: "Gastos" },
  { icon: TrendingUp, label: "Activos" },
  { icon: Landmark, label: "Deudas" },
  { icon: Target, label: "Metas" },
  { icon: BarChart3, label: "Reportes" },
  { icon: Settings, label: "Configuración" },
];

export default function Sidebar({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  return (
    <aside className="w-72 h-screen bg-slate-900 border-r border-slate-800 flex flex-col">

      <div className="p-8">
        <h1 className="text-2xl font-bold text-white">
          Financial AI
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Tu libertad financiera
        </p>
      </div>

      <nav className="flex-1 px-4">

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Dashboard") {
                  window.location.assign("/");
                }
                if (item.label === "Ingresos") {
                  window.location.assign("/income");
                }
                if (item.label === "Gastos") {
                  window.location.assign("/expense");
                }
                if (item.label === "Activos") {
                  window.location.assign("/assets");
                }
                if (item.label === "Deudas") {
                  window.location.assign("/liabilities");
                }
                if (item.label === "Metas") {
                  window.location.assign("/goals");
                }
                if (item.label === "Reportes") {
                  window.location.assign("/reports");
                }
                if (item.label === "Configuración") {
                  window.location.assign("/settings");
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all mb-2"
            >
              <Icon size={20} />

              {item.label}
            </button>
          );
        })}

      </nav>

      <div className="p-6 border-t border-slate-800">

        <div className="text-white font-semibold">
          {userName}
        </div>

        <div className="text-slate-400 text-sm">
          Miembro
        </div>

        <button onClick={onLogout} className="mt-5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white">
          <LogOut size={20} />
          Cerrar sesión
        </button>

      </div>

    </aside>
  );
}
