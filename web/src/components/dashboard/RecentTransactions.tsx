import {
  IconArrowDownRight,
  IconArrowUpRight,
} from "@tabler/icons-react";

const transactions = [
  {
    title: "Salario",
    amount: "+ S/ 3,500",
    type: "income",
  },
  {
    title: "Supermercado",
    amount: "- S/ 280",
    type: "expense",
  },
  {
    title: "Internet",
    amount: "- S/ 89",
    type: "expense",
  },
  {
    title: "Dividendos",
    amount: "+ S/ 120",
    type: "income",
  },
];

export default function RecentTransactions() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">

      <h2 className="text-xl font-semibold mb-6">
        Últimos movimientos
      </h2>

      <div className="space-y-5">

        {transactions.map((item, index) => (

          <div
            key={index}
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
              {item.amount}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}