import { BarChart3, CreditCard, Landmark, LayoutDashboard, LogOut, Target, TrendingUp, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const groups = [
  { title: "RESUMEN", items: [[LayoutDashboard, "Dashboard", "/"], [BarChart3, "Reportes", "/reports"]] },
  { title: "FLUJO DE CAJA", items: [[Wallet, "Ingresos", "/income"], [CreditCard, "Gastos", "/expense"], [Landmark, "Pagos pendientes", "/payments"]] },
  { title: "CONSTRUYE RIQUEZA", items: [[TrendingUp, "Activos", "/assets"], [Target, "Metas", "/goals"]] },
  { title: "DEUDAS Y CRÉDITOS", items: [[Landmark, "Deudas", "/debts"], [Landmark, "Editar créditos", "/credit-edit"]] },
] as const;

export default function SidebarV2({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const navigate = useNavigate();
  return <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900"><div className="p-8"><h1 className="text-2xl font-bold text-white">Financial AI</h1><p className="mt-1 text-sm text-slate-400">Tu libertad financiera</p></div><nav className="flex-1 overflow-y-auto px-4">{groups.map((group) => <section key={group.title} className="mb-5"><p className="mb-2 px-4 text-xs font-semibold tracking-wider text-slate-500">{group.title}</p>{group.items.map(([Icon, label, path]) => <button key={label} onClick={() => navigate(path)} className="mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"><Icon size={20} />{label}</button>)}</section>)}</nav><div className="border-t border-slate-800 p-6"><div className="font-semibold text-white">{userName}</div><p className="text-sm text-slate-400">Miembro</p><button onClick={onLogout} className="mt-5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800"><LogOut size={20} />Cerrar sesión</button></div></aside>;
}
