type Props = {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
};

export default function FinancialCard({
  title,
  value,
  subtitle,
  color = "text-white",
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg hover:border-cyan-500 transition-all">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2 className={`mt-3 text-3xl font-bold ${color}`}>
        {value}
      </h2>

      {subtitle && (
        <p className="mt-3 text-sm text-slate-500">
          {subtitle}
        </p>
      )}

    </div>
  );
}