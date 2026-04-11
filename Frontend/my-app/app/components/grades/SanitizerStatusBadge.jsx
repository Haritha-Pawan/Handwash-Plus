export default function SanitizerStatusBadge({ status = "adequate" }) {
  const value = String(status).toLowerCase();

  const styles = {
    adequate: "bg-emerald-100 text-emerald-700 border-emerald-200",
    low: "bg-yellow-100 text-yellow-700 border-yellow-200",
    critical: "bg-orange-100 text-orange-700 border-orange-200",
    empty: "bg-rose-100 text-rose-700 border-rose-200",
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