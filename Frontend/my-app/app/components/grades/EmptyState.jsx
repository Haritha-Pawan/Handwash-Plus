export default function EmptyState({ title = "No data found", subtitle = "" }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-10 text-center">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      {subtitle ? <p className="mt-2 text-slate-400">{subtitle}</p> : null}
    </div>
  );
}