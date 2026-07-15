import { Crown } from "lucide-react";
import FinancialCard from "./FinancialCard";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function NetWorthCard({ total }: { total: number }) {
  const { formatCurrency } = useCurrency();
  return (
    <FinancialCard
      title="Patrimonio Neto"
      value={formatCurrency(total)}
      color="text-emerald-400"
      icon={<Crown size={20} className="text-emerald-400" />}
      trend="up"
      trendValue="0.0%"
      subtitle="Tu riqueza acumulada"
    />
  );
}

