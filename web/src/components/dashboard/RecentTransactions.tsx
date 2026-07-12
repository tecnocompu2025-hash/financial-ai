import {
  IconArrowDownRight,
  IconArrowUpRight,
} from "@tabler/icons-react";

type Transaction = { id: number; title: string; amount: number; type: "income" | "expense" };

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">

      <h2 className="text-xl font-semibold mb-6">
        Últimos movimientos
      </h2>

      <div className="space-y-5">

        {transactions.length === 0 && <p className="text-slate-400">Aún no tienes movimientos registrados.</p>}
        {transactions.map((item) => (

          <div
            key={`${item.type}-${item.id}`}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-3">

              {item.type === "income" ? (
                <IconArrowUpRight className="text-green-400" />
              ) : (
                <IconArrowDownRight className="text-red-400" />
              )}

              <span>{item.title}</span>

            </div>

            <span
              className={
                item.type === "income"
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {item.type === "income" ? "+" : "-"} S/ {item.amount.toFixed(2)}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}
