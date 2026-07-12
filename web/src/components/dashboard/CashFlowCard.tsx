import FinancialCard from "./FinancialCard";

export default function CashFlowCard({ total }: { total: number }) {
  return (
    <FinancialCard title="Flujo de caja" value={`S/ ${total.toFixed(2)}`} color={total >= 0 ? "text-cyan-400" : "text-red-400"} />
  );
}
