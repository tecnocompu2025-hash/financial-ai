import { Wallet } from "lucide-react";
import FinancialCard from "./FinancialCard";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function IncomeCards({ total, count, onView }: { total: number; count: number; onView?: () => void }) {
  const { formatCurrency } = useCurrency();
  return (
    <FinancialCard
      title="Ingresos registrados"
      value={formatCurrency(total)}
      subtitle={`${count} ${count === 1 ? "registro" : "registros"}`}
      color="text-emerald-400"
      icon={<Wallet size={20} className="text-emerald-400" />}
      trend="up"
      onView={onView}
    />
  );
}

