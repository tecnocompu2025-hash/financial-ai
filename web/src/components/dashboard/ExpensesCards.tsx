import FinancialCard from "./FinancialCard";

export default function ExpensesCards({ total, count }: { total: number; count: number }) {
  return (
    <FinancialCard title="Gastos registrados" value={`S/ ${total.toFixed(2)}`} subtitle={`${count} ${count === 1 ? "registro" : "registros"}`} color="text-red-400" />
  );
}
