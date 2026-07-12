import FinancialCard from "./FinancialCard";

export default function NetWorthCard({ total }: { total: number }) {
  return (
    <FinancialCard
      title="Patrimonio Neto"
      value={`S/ ${total.toFixed(2)}`}
      subtitle="▲ 0%"
      color="text-green-400"
    />
  );
}
