import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ApiError } from "../../services/api";
import { downloadFinancialReport, getFinancialReport } from "../../services/financial.service";
import type { FinancialReport, ReportFilters } from "../../types/financial";

const currency = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const emptyFilters: ReportFilters = { record_type: "all" };

export default function ReportManagerV3({ token }: { token: string }) {
  const [filters, setFilters] = useState<ReportFilters>(emptyFilters);
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setError("");
    void getFinancialReport(token, filters).then(setReport).catch((reason: unknown) => setError(reason instanceof ApiError ? reason.message : "No se pudo cargar el reporte.")).finally(() => setLoading(false));
  }, [token, filters]);

  const update = (key: keyof ReportFilters, value: string) => setFilters((current) => ({ ...current, [key]: key === "month" || key === "year" ? (value ? Number(value) : undefined) : value || undefined }));
  const summary = report?.summary;
  const assetDebt = summary ? [{ name: "Activos", value: summary.asset_total, fill: "#22d3ee" }, { name: "Pasivos", value: summary.liability_total, fill: "#fb7185" }] : [];
  return <main className="min-h-screen bg-slate-950 p-5 text-white md:p-8">
    <button onClick={() => window.history.back()} className="text-cyan-400">Volver</button>
    <h1 className="mt-5 text-3xl font-bold">Reporte financiero</h1>
    <p className="mt-1 text-slate-400">Analiza tu flujo de efectivo y toma decisiones basadas en tus datos reales.</p>
    <div className="mt-4 flex gap-3"><button onClick={() => void downloadFinancialReport(token, "pdf").catch(() => setError("No se pudo exportar el PDF."))} className="rounded bg-slate-800 px-4 py-2">Exportar PDF</button><button onClick={() => void downloadFinancialReport(token, "xlsx").catch(() => setError("No se pudo exportar el Excel."))} className="rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Exportar Excel</button></div>
    <section className="mt-6 grid max-w-6xl gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-3 lg:grid-cols-6">
      <select aria-label="Mes" value={filters.month ?? ""} onChange={(event) => update("month", event.target.value)} className="rounded bg-slate-800 p-2"><option value="">Todos los meses</option>{months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}</select>
      <input aria-label="Año" type="number" min="2000" max="2100" placeholder="Año" value={filters.year ?? ""} onChange={(event) => update("year", event.target.value)} className="rounded bg-slate-800 p-2" />
      <select aria-label="Categoría" value={filters.category ?? ""} onChange={(event) => update("category", event.target.value)} className="rounded bg-slate-800 p-2"><option value="">Todas las categorías</option>{(report?.categories ?? []).map((category) => <option key={category}>{category}</option>)}</select>
      <select aria-label="Tipo de movimiento" value={filters.record_type ?? "all"} onChange={(event) => update("record_type", event.target.value)} className="rounded bg-slate-800 p-2"><option value="all">Ingresos y gastos</option><option value="income">Solo ingresos</option><option value="expense">Solo gastos</option></select>
      <input aria-label="Desde" type="date" value={filters.date_from ?? ""} onChange={(event) => update("date_from", event.target.value)} className="rounded bg-slate-800 p-2" />
      <input aria-label="Hasta" type="date" value={filters.date_to ?? ""} onChange={(event) => update("date_to", event.target.value)} className="rounded bg-slate-800 p-2" />
      <button onClick={() => setFilters(emptyFilters)} className="rounded bg-slate-700 px-3 py-2 text-sm">Limpiar filtros</button>
    </section>
    {error && <p role="alert" className="mt-4 rounded bg-rose-950 p-3 text-rose-200">{error}</p>}
    {loading && <p className="mt-6 text-slate-400">Actualizando reporte…</p>}
    {summary && <>
      <section className="mt-6 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[["Ingresos", summary.income_total, "text-emerald-300"], ["Gastos", summary.expense_total, "text-rose-300"], ["Flujo de caja", summary.cash_flow, "text-cyan-300"], ["Patrimonio neto", summary.net_worth, "text-violet-300"]].map(([label, value, color]) => <article key={String(label)} className="rounded-xl border border-slate-800 bg-slate-900 p-4"><p className="text-sm text-slate-400">{label}</p><strong className={`mt-1 block text-xl ${color}`}>{currency.format(Number(value))}</strong></article>)}
      </section>
      <section className="mt-6 grid max-w-6xl gap-5 lg:grid-cols-2">
        <Chart title="Evolución mensual"><LineChart data={report?.monthly_evolution}><CartesianGrid stroke="#1e293b" /><XAxis dataKey="month" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Legend /><Line type="monotone" dataKey="income" name="Ingresos" stroke="#34d399" strokeWidth={2} /><Line type="monotone" dataKey="expense" name="Gastos" stroke="#fb7185" strokeWidth={2} /><Line type="monotone" dataKey="balance" name="Balance" stroke="#22d3ee" strokeWidth={2} /></LineChart></Chart>
        <Chart title="Flujo de caja"><BarChart data={report?.monthly_evolution}><CartesianGrid stroke="#1e293b" /><XAxis dataKey="month" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Legend /><Bar dataKey="income" name="Ingresos" fill="#34d399" /><Bar dataKey="expense" name="Gastos" fill="#fb7185" /><Bar dataKey="balance" name="Balance" fill="#22d3ee" /></BarChart></Chart>
        <Chart title="Activos vs. pasivos"><PieChart><Pie data={assetDebt} dataKey="value" nameKey="name" outerRadius={100} label /><Tooltip /></PieChart></Chart>
        <article className="rounded-xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-semibold">Indicadores</h2><dl className="mt-4 space-y-3 text-slate-300"><div className="flex justify-between"><dt>Ingresos pasivos</dt><dd>{currency.format(summary.passive_income_total)}</dd></div><div className="flex justify-between"><dt>Deuda total</dt><dd>{currency.format(summary.liability_total)}</dd></div><div className="flex justify-between"><dt>Endeudamiento</dt><dd>{summary.debt_ratio.toFixed(1)}%</dd></div></dl></article>
      </section>
      <section className="mt-6 grid max-w-6xl gap-4 md:grid-cols-2"><article className="rounded-xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-semibold">Fondo de emergencia</h2><p className="mt-2 text-2xl text-cyan-300">{report.financial_health.emergency_months.toFixed(1)} meses</p><p className="mt-2 text-sm text-slate-400">Disponible: {currency.format(report.financial_health.emergency_fund_available)} · Base de gastos filtrados: {currency.format(report.financial_health.essential_monthly_expenses)}</p></article><article className="rounded-xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-semibold">Libertad financiera</h2><p className="mt-2 text-2xl text-emerald-300">{report.financial_health.financial_freedom_percentage.toFixed(1)}%</p><p className="mt-2 text-sm text-slate-400">Ingresos pasivos frente a gastos filtrados. Activos productivos: {currency.format(report.financial_health.productive_assets)}</p></article></section>
      <section className="mt-6 max-w-6xl rounded-xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-semibold">Recomendaciones</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">{report.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}</ul></section>
      <section className="mt-6 max-w-6xl rounded-xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-semibold">Movimientos filtrados</h2><div className="mt-4 max-h-80 overflow-auto"><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr><th>Fecha</th><th>Tipo</th><th>Categoría</th><th>Detalle</th><th className="text-right">Monto</th></tr></thead><tbody>{report?.transactions.map((item) => <tr key={`${item.record_type}-${item.id}`} className="border-t border-slate-800"><td className="py-2">{item.date}</td><td>{item.record_type === "income" ? "Ingreso" : "Gasto"}</td><td>{item.category}</td><td>{item.name}</td><td className="text-right">{currency.format(item.amount)}</td></tr>)}</tbody></table>{report?.transactions.length === 0 && <p className="py-6 text-center text-slate-400">No hay movimientos para los filtros seleccionados.</p>}</div></section>
    </>}
  </main>;
}

function Chart({ title, children }: { title: string; children: React.ReactElement }) {
  return <article className="h-80 rounded-xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-semibold">{title}</h2><div className="mt-3 h-64"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div></article>;
}
