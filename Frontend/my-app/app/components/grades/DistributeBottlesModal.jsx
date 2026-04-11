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

    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/10 text-lg">
              🧴
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Distribute Bottles
              </h2>
              <p className="text-xs text-slate-500 font-medium">Grade {grade.gradeNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Stock info */}
        <div className="mx-6 mt-5 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
          <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider">Current Stock Available</p>
          <p className="mt-0.5 text-2xl font-bold text-violet-700">
            {currentStock} <span className="text-sm font-normal text-violet-500">{unit}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Bottles per Classroom
              </label>
              <span className="text-xs text-slate-500 font-medium">min 1</span>
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
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
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
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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