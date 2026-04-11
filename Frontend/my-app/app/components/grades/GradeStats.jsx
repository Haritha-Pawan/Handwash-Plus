export default function GradeStats({ stats }) {
  const items = [
    {
      label: "Total Grades",
      value: stats.total,
      color: "border-sky-100 bg-white",
      valueColor: "text-sky-600",
      labelColor: "text-sky-600/60",
    },
    {
      label: "Active Grades",
      value: stats.active,
      color: "border-emerald-100 bg-white",
      valueColor: "text-emerald-600",
      labelColor: "text-emerald-600/60",
    },
    {
      label: "Low Stock",
      value: stats.low,
      color:
        stats.low > 0
          ? "border-yellow-100 bg-white"
          : "border-slate-100 bg-white",
      valueColor: stats.low > 0 ? "text-yellow-600" : "text-slate-400",
      labelColor: stats.low > 0 ? "text-yellow-600/60" : "text-slate-400/60",
    },
    {
      label: "Critical / Empty",
      value: stats.critical,
      color:
        stats.critical > 0
          ? "border-rose-100 bg-white"
          : "border-slate-100 bg-white",
      valueColor: stats.critical > 0 ? "text-rose-600" : "text-slate-400",
      labelColor: stats.critical > 0 ? "text-rose-600/60" : "text-slate-400/60",
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