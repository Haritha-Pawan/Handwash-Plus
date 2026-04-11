"use client";

import { useEffect, useState } from "react";

export default function DistributeBottlesModal({
  isOpen,
  onClose,
  onSubmit,
  grade,
  loading = false,
}) {
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-04"

  const [form, setForm] = useState({
    bottlesPerClassroom: "",
    month: currentMonth,
  });

  useEffect(() => {
    if (isOpen) {
      setForm({ bottlesPerClassroom: "", month: currentMonth });
    }
  }, [isOpen]);

  if (!isOpen || !grade) return null;

  const currentStock = grade?.sanitizer?.currentQuantity ?? 0;
  const unit = grade?.sanitizer?.unit || "ml";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      bottlesPerClassroom: Number(form.bottlesPerClassroom),
      month: form.month,
    });
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white placeholder:text-slate-600 outline-none focus:border-violet-500/60 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-lg">
              🧴
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Distribute Bottles
              </h2>
              <p className="text-xs text-slate-500">Grade {grade.gradeNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-white/10 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Stock info */}
        <div className="mx-6 mt-5 rounded-xl border border-violet-400/15 bg-violet-400/5 px-4 py-3">
          <p className="text-xs text-violet-400/70">Current Stock Available</p>
          <p className="mt-0.5 text-2xl font-bold text-violet-300">
            {currentStock} <span className="text-sm font-normal">{unit}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label className="text-sm font-medium text-slate-200">
                Bottles per Classroom
              </label>
              <span className="text-xs text-slate-500">min 1</span>
            </div>
            <input
              type="number"
              min="1"
              required
              value={form.bottlesPerClassroom}
              placeholder="e.g. 5"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bottlesPerClassroom: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-200">
              Month
            </label>
            <input
              type="month"
              required
              value={form.month}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, month: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60 transition-colors"
            >
              {loading ? "Distributing..." : "Distribute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}