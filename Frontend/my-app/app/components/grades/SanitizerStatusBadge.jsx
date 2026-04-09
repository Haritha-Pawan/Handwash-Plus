export default function SanitizerStatusBadge({ status = "adequate" }) {
  const value = String(status).toLowerCase();

  const styles = {
    adequate: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
    low: "bg-yellow-500/15 text-yellow-300 border-yellow-400/20",
    critical: "bg-orange-500/15 text-orange-300 border-orange-400/20",
    empty: "bg-rose-500/15 text-rose-300 border-rose-400/20",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
        styles[value] || styles.adequate
      }`}
    >
      {value.charAt(0).toUpperCase() + value.slice(1)}
    </span>
  );
}