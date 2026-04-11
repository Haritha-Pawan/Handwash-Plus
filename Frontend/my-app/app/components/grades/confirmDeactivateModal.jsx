"use client";

export default function ConfirmDeactivateModal({
  isOpen,
  onClose,
  onConfirm,
  grade,
  loading = false,
}) {
  if (!isOpen || !grade) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6">
        <h2 className="text-xl font-semibold text-white">Deactivate Grade</h2>
        <p className="mt-3 text-slate-300">
          Are you sure you want to deactivate Grade {grade.gradeNumber}?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-rose-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Deactivating..." : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}