import FinancialCard from "./FinancialCard";

export default function IncomeCards({ total, count }: { total: number; count: number }) {
  return (
    <FinancialCard
      title="Ingresos registrados"
      value={`S/ ${total.toFixed(2)}`}
      subtitle={`${count} ${count === 1 ? "registro" : "registros"}`}
      color="text-green-400"
    />
  );
}
