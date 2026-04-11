export default function SanitizerFillBar({ currentQty, threshold, unit = "ml", status }) {
  const safeThreshold = threshold > 0 ? threshold : 1;
  const rawPercent = (currentQty / safeThreshold) * 100;
  const percent = Math.min(100, Math.max(0, rawPercent));

  const barColor =
    status === "empty"
      ? "bg-rose-500"
      : status === "critical"
      ? "bg-orange-500"
      : status === "low"
      ? "bg-yellow-400"
      : "bg-emerald-500";

  const glowColor =
    status === "empty"
      ? "shadow-rose-500/20"
      : status === "critical"
      ? "shadow-orange-500/20"
      : status === "low"
      ? "shadow-yellow-400/20"
      : "shadow-emerald-500/20";

  return (
    <div className="min-w-[120px]">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-900">
          {currentQty} {unit}
        </span>
        <span className="text-xs text-slate-500 font-medium">/ {threshold}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor} shadow-sm ${glowColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
