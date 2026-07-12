import type { Goal } from "../../types/financial";

export default function GoalsCardV2({ goals }: { goals: Goal[] }) {
  return <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg h-full"><h2 className="text-xl font-semibold mb-6">Metas financieras</h2>{goals.length === 0 ? <p className="text-slate-400">Crea tu primera meta desde el menú Metas.</p> : <div className="space-y-5">{goals.map((goal) => { const percent = Math.min(100, goal.current_amount / goal.target_amount * 100); return <div key={goal.id}><div className="flex justify-between mb-2"><span>{goal.name}</span><span>{percent.toFixed(0)}%</span></div><div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${percent}%` }} /></div></div>; })}</div>}</div>;
}
