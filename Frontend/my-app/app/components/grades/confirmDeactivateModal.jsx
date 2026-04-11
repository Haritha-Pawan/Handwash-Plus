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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600/10 text-lg">
              ⚠️
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Deactivate Grade</h2>
              <p className="text-xs text-slate-500 font-medium">This action can be reversed later</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-slate-600">
            Are you sure you want to deactivate{" "}
            <span className="font-bold text-slate-900">Grade {grade.gradeNumber}</span>?
          </p>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            The grade will be hidden from the active list but its data will be preserved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/30 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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