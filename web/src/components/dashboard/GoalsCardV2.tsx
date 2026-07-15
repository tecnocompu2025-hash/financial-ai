import { Target } from "lucide-react";
import type { Goal } from "../../types/financial";

export default function GoalsCardV2({ goals }: { goals: Goal[] }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 backdrop-blur-md transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <Target size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Metas Financieras</h2>
          <p className="text-xs text-slate-400">Progreso de tus objetivos</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {goals.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 rounded-full bg-slate-800/50 p-4 text-slate-500">
              <Target size={24} />
            </div>
            <p className="text-sm text-slate-400">Aún no tienes metas registradas.</p>
            <p className="mt-1 text-xs text-slate-500">Comienza creando tu primera meta en la sección Metas.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => {
              const percent = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
              return (
                <div key={goal.id} className="group">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-300 transition-colors group-hover:text-white">
                      {goal.name}
                    </span>
                    <span className="font-bold text-indigo-400">{percent.toFixed(0)}%</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/60">
                    <div 
                      className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 ease-out"
                      style={{ width: `${percent}%` }} 
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                    <span>S/ {goal.current_amount.toFixed(0)}</span>
                    <span>S/ {goal.target_amount.toFixed(0)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
