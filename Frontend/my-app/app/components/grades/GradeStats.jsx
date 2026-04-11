export default function GradeStats({ stats }) {
  const items = [
    {
      label: "Total Grades",
      value: stats.total,
      color: "border-sky-500/20 bg-sky-500/10",
      valueColor: "text-sky-300",
      labelColor: "text-sky-400/70",
    },
    {
      label: "Active Grades",
      value: stats.active,
      color: "border-emerald-500/20 bg-emerald-500/10",
      valueColor: "text-emerald-300",
      labelColor: "text-emerald-400/70",
    },
    {
      label: "Low Stock",
      value: stats.low,
      color:
        stats.low > 0
          ? "border-yellow-500/20 bg-yellow-500/10"
          : "border-white/10 bg-slate-900/70",
      valueColor: stats.low > 0 ? "text-yellow-300" : "text-slate-300",
      labelColor: stats.low > 0 ? "text-yellow-400/70" : "text-slate-400",
    },
    {
      label: "Critical / Empty",
      value: stats.critical,
      color:
        stats.critical > 0
          ? "border-rose-500/20 bg-rose-500/10"
          : "border-white/10 bg-slate-900/70",
      valueColor: stats.critical > 0 ? "text-rose-300" : "text-slate-300",
      labelColor: stats.critical > 0 ? "text-rose-400/70" : "text-slate-400",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-2xl border p-5 shadow-sm transition-colors ${item.color}`}
        >
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${item.labelColor}`}>{item.label}</p>
            <span className="text-xl">{item.icon}</span>
          </div>
          <p className={`mt-3 text-4xl font-bold ${item.valueColor}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}