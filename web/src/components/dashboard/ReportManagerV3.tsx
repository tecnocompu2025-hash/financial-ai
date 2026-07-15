import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ApiError } from "../../services/api";
import { downloadFinancialReport, getFinancialReport } from "../../services/financial.service";
import type { FinancialReport, ReportFilters } from "../../types/financial";

import { useCurrency } from "../../contexts/CurrencyContext";

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const emptyFilters: ReportFilters = { record_type: "all" };

export default function ReportManagerV3({ token }: { token: string }) {
  const [filters, setFilters] = useState<ReportFilters>(emptyFilters);
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { formatCurrency, baseCurrency, exchangeRate } = useCurrency();

  useEffect(() => {
    setLoading(true); setError("");
    const fetchFilters = { ...filters, base_currency: baseCurrency, exchange_rate: exchangeRate };
    void getFinancialReport(token, fetchFilters).then(setReport).catch((reason: unknown) => setError(reason instanceof ApiError ? reason.message : "No se pudo cargar el reporte.")).finally(() => setLoading(false));
  }, [token, filters, baseCurrency, exchangeRate]);

  const update = (key: keyof ReportFilters, value: string) => setFilters((current) => ({ ...current, [key]: key === "month" || key === "year" ? (value ? Number(value) : undefined) : value || undefined }));
  const handleDownload = (format: "pdf" | "xlsx") => {
    const fetchFilters = { ...filters, base_currency: baseCurrency, exchange_rate: exchangeRate };
    void downloadFinancialReport(token, format, fetchFilters).catch(() => setError(`No se pudo exportar el ${format.toUpperCase()}.`));
  };
  const summary = report?.summary;
  const assetDebt = summary ? [{ name: "Activos", value: summary.asset_total, fill: "#22d3ee" }, { name: "Pasivos", value: summary.liability_total, fill: "#fb7185" }] : [];
  return <main className="min-h-screen bg-slate-950 p-5 text-white md:p-8">
    <button onClick={() => window.history.back()} className="text-cyan-400">Volver</button>
    <h1 className="mt-5 text-3xl font-bold">Reporte financiero</h1>
    <p className="mt-1 text-slate-400">Analiza tu flujo de efectivo y toma decisiones basadas en tus datos reales.</p>
    <div className="mt-4 flex gap-3"><button onClick={() => handleDownload("pdf")} className="rounded bg-slate-800 px-4 py-2 hover:bg-slate-700 transition-colors">Exportar PDF</button><button onClick={() => handleDownload("xlsx")} className="rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 transition-colors">Exportar Excel</button></div>
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
        {[["Ingresos", summary.income_total, "text-emerald-300"], ["Gastos", summary.expense_total, "text-rose-300"], ["Flujo de caja", summary.cash_flow, "text-cyan-300"], ["Patrimonio neto", summary.net_worth, "text-violet-300"]].map(([label, value, color]) => <article key={String(label)} className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg"><p className="text-sm text-slate-400">{label}</p><strong className={`mt-1 block text-2xl ${color}`}>{formatCurrency(Number(value))}</strong></article>)}
      </section>
      <section className="mt-6 grid max-w-6xl gap-5 lg:grid-cols-2">
        <Chart title="Evolución mensual"><LineChart data={report?.monthly_evolution}><CartesianGrid stroke="#1e293b" /><XAxis dataKey="month" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Legend /><Line type="monotone" dataKey="income" name="Ingresos" stroke="#34d399" strokeWidth={2} /><Line type="monotone" dataKey="expense" name="Gastos" stroke="#fb7185" strokeWidth={2} /><Line type="monotone" dataKey="balance" name="Balance" stroke="#22d3ee" strokeWidth={2} /></LineChart></Chart>
        <Chart title="Flujo de caja"><BarChart data={report?.monthly_evolution}><CartesianGrid stroke="#1e293b" /><XAxis dataKey="month" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Legend /><Bar dataKey="income" name="Ingresos" fill="#34d399" /><Bar dataKey="expense" name="Gastos" fill="#fb7185" /><Bar dataKey="balance" name="Balance" fill="#22d3ee" /></BarChart></Chart>
        <Chart title="Activos vs. pasivos"><PieChart><Pie data={assetDebt} dataKey="value" nameKey="name" outerRadius={100} label /><Tooltip /></PieChart></Chart>
        <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg"><h2 className="font-semibold text-lg text-slate-200">Indicadores Clave</h2><dl className="mt-6 space-y-4 text-slate-300"><div className="flex justify-between items-center border-b border-slate-800 pb-2"><dt className="text-slate-400">Ingresos pasivos</dt><dd className="font-semibold text-emerald-400">{formatCurrency(summary.passive_income_total)}</dd></div><div className="flex justify-between items-center border-b border-slate-800 pb-2"><dt className="text-slate-400">Deuda total</dt><dd className="font-semibold text-rose-400">{formatCurrency(summary.liability_total)}</dd></div><div className="flex justify-between items-center"><dt className="text-slate-400">Endeudamiento</dt><dd className="font-semibold text-cyan-400">{summary.debt_ratio.toFixed(1)}%</dd></div></dl></article>
      </section>
      <section className="mt-6 grid max-w-6xl gap-4 md:grid-cols-2"><article className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg"><h2 className="font-semibold text-lg">Fondo de emergencia</h2><p className="mt-2 text-3xl font-bold text-cyan-400">{report.financial_health.emergency_months.toFixed(1)} <span className="text-lg font-normal text-slate-500">meses</span></p><p className="mt-4 text-sm text-slate-400">Disponible: <span className="text-slate-200">{formatCurrency(report.financial_health.emergency_fund_available)}</span></p><p className="mt-1 text-sm text-slate-400">Gastos esenciales mensuales: <span className="text-slate-200">{formatCurrency(report.financial_health.essential_monthly_expenses)}</span></p></article><article className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg"><h2 className="font-semibold text-lg">Libertad financiera</h2><p className="mt-2 text-3xl font-bold text-emerald-400">{report.financial_health.financial_freedom_percentage.toFixed(1)}%</p><p className="mt-4 text-sm text-slate-400">Activos productivos: <span className="text-slate-200">{formatCurrency(report.financial_health.productive_assets)}</span></p><p className="mt-1 text-sm text-slate-400">Tus ingresos pasivos cubren el {report.financial_health.financial_freedom_percentage.toFixed(1)}% de tus gastos.</p></article></section>
      <section className="mt-6 max-w-6xl rounded-xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-semibold">Recomendaciones</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">{report.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}</ul></section>
      <section className="mt-6 max-w-6xl rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg"><h2 className="font-semibold text-lg">Movimientos filtrados</h2><div className="mt-4 max-h-80 overflow-auto rounded border border-slate-800"><table className="w-full text-left text-sm"><thead className="bg-slate-950 text-slate-400"><tr><th className="p-3">Fecha</th><th className="p-3">Tipo</th><th className="p-3">Categoría</th><th className="p-3">Detalle</th><th className="p-3 text-right">Monto</th></tr></thead><tbody>{report?.transactions.map((item) => <tr key={`${item.record_type}-${item.id}`} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors"><td className="p-3 text-slate-300">{item.date}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${item.record_type === "income" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>{item.record_type === "income" ? "Ingreso" : "Gasto"}</span></td><td className="p-3 text-slate-300">{item.category}</td><td className="p-3 text-slate-300">{item.name}</td><td className={`p-3 text-right font-medium ${item.record_type === "income" ? "text-emerald-400" : "text-rose-400"}`}>{formatCurrency(item.amount)}</td></tr>)}</tbody></table>{report?.transactions.length === 0 && <p className="py-8 text-center text-slate-500">No hay movimientos para los filtros seleccionados.</p>}</div></section>
    </>}
  </main>;
}

function Chart({ title, children }: { title: string; children: React.ReactElement }) {
  return <article className="h-80 rounded-xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-semibold">{title}</h2><div className="mt-3 h-64"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div></article>;
}
