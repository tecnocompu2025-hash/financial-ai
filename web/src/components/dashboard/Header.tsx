import { Search, Bell, DollarSign, Wallet } from "lucide-react";
import { formatName } from "../../utils/formatName";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function Header({ userName }: { userName: string }) {
  const { isUSD, toggleCurrency, isLoading } = useCurrency();

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-800/50 bg-slate-950/80 px-8 backdrop-blur-xl">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        Dashboard
      </h2>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="h-10 w-64 rounded-full border border-slate-800 bg-slate-900/50 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Currency Toggle */}
        <button 
          onClick={toggleCurrency}
          disabled={isLoading}
          className="group flex h-10 items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-4 text-sm font-medium text-slate-400 transition-colors hover:border-indigo-500 hover:text-white disabled:opacity-50"
          title="Cambiar moneda"
        >
          <div className="flex items-center gap-1">
            <span className={!isUSD ? "text-indigo-400 font-bold" : ""}>LOCAL</span>
            <span className="text-slate-600">/</span>
            <span className={isUSD ? "text-emerald-400 font-bold" : ""}>USD</span>
          </div>
          {isUSD ? <DollarSign size={16} className="text-emerald-400" /> : <Wallet size={16} className="text-indigo-400" />}
        </button>

        {/* Actions */}
        <button className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-950"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-sm font-medium text-white shadow-lg shadow-indigo-900/20">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden flex-col text-sm md:flex">
            <span className="font-medium text-slate-200">{formatName(userName)}</span>
            <span className="text-xs text-slate-500">Miembro VIP</span>
          </div>
        </div>
      </div>
    </header>
  );
}
