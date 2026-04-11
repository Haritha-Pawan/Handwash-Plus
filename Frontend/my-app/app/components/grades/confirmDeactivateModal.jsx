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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-lg">
              ⚠️
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Deactivate Grade</h2>
              <p className="text-xs text-slate-500">This action can be reversed later</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-white/10 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-slate-300">
            Are you sure you want to deactivate{" "}
            <span className="font-semibold text-white">Grade {grade.gradeNumber}</span>?
          </p>
          <p className="mt-2 text-sm text-slate-500">
            The grade will be hidden from the active list but its data will be preserved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60 transition-colors"
          >
            {loading ? "Deactivating..." : "Yes, Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}