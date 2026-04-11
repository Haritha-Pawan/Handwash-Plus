"use client";

import { useEffect, useState } from "react";

export default function DistributeBottlesModal({
  isOpen,
  onClose,
  onSubmit,
  grade,
  loading = false,
}) {
  const [form, setForm] = useState({
    bottlesPerClassroom: "",
    month: "",
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        bottlesPerClassroom: "",
        month: "",
      });
    }
  }, [isOpen]);

  if (!isOpen || !grade) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      bottlesPerClassroom: Number(form.bottlesPerClassroom),
      month: form.month,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6">
        <h2 className="text-xl font-semibold text-white">
          Distribute Bottles - Grade {grade.gradeNumber}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Bottles Per Classroom
            </label>
            <input
              type="number"
              min="1"
              required
              value={form.bottlesPerClassroom}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  bottlesPerClassroom: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Month</label>
            <input
              type="month"
              required
              value={form.month}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  month: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {loading ? "Distributing..." : "Distribute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}