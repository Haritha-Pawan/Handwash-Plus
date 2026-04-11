export default function GradeStats({ stats }) {
  const items = [
    { label: "Total Grades", value: stats.total },
    { label: "Active Grades", value: stats.active },
    { label: "Low Stock", value: stats.low },
    { label: "Critical / Empty", value: stats.critical },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-sm"
        >
          <p className="text-sm text-slate-400">{item.label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}