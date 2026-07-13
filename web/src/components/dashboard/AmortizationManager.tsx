import { useState } from "react";
import { getAmortization, getMortgages } from "../../services/financial.service";
import type { AmortizationRow, Mortgage } from "../../types/financial";

export default function AmortizationManager({ token }: { token: string }) {
  const [credits, setCredits] = useState<Mortgage[]>([]); const [rows, setRows] = useState<AmortizationRow[]>([]); const [name, setName] = useState("");
  async function load() { setCredits(await getMortgages(token)); }
  async function select(credit: Mortgage) { setName(`${credit.credit_type}: ${credit.name}`); setRows(await getAmortization(token, credit.id)); }
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => window.history.back()} className="text-cyan-400">Volver</button><h1 className="mt-5 text-3xl font-bold">Tabla de amortización</h1><button className="mt-5 rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-950" onClick={() => void load()}>Cargar créditos</button><div className="mt-5 flex flex-wrap gap-3">{credits.map((credit) => <button key={credit.id} className="rounded bg-slate-800 px-4 py-2" onClick={() => void select(credit)}>{credit.credit_type}: {credit.name}</button>)}</div>{rows.length > 0 && <section className="mt-8 overflow-x-auto"><h2 className="mb-3 text-xl font-semibold">{name}</h2><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-700"><th>Cuota</th><th>Pago</th><th>Interés</th><th>Capital</th><th>Saldo</th></tr></thead><tbody>{rows.map((row) => <tr key={row.installment} className="border-b border-slate-800"><td>{row.installment}</td><td>S/ {row.payment.toFixed(2)}</td><td>S/ {row.interest.toFixed(2)}</td><td>S/ {row.principal.toFixed(2)}</td><td>S/ {row.remaining_balance.toFixed(2)}</td></tr>)}</tbody></table></section>}</main>;
}
