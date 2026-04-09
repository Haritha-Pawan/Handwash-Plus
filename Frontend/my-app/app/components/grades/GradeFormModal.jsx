"use client";

import { useEffect, useState } from "react";

export default function GradeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "create",
  loading = false,
}) {
  const [form, setForm] = useState({
    count: "",
    studentCount: "",
    lowThreshold: "",
  });

  useEffect(() => {
    if (initialData && mode === "edit") {
      setForm({
        count: "",
        studentCount: initialData.studentCount ?? "",
        lowThreshold: initialData?.sanitizer?.lowThreshold ?? "",
      });
    } else {
      setForm({
        count: "",
        studentCount: "",
        lowThreshold: "",
      });
    }
  }, [initialData, mode]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "create") {
      onSubmit({
        count: Number(form.count),
      });
      return;
    }

    onSubmit({
      studentCount:
        form.studentCount === "" ? undefined : Number(form.studentCount),
      lowThreshold:
        form.lowThreshold === "" ? undefined : Number(form.lowThreshold),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6">
        <h2 className="text-xl font-semibold text-white">
          {mode === "create" ? "Create Grades" : "Edit Grade"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {mode === "create" ? (
            <div>
              <label className="mb-2 block text-sm text-slate-300">Count</label>
              <input
                type="number"
                name="count"
                value={form.count}
                onChange={handleChange}
                min="1"
                max="13"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Student Count</label>
                <input
                  type="number"
                  name="studentCount"
                  value={form.studentCount}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Low Threshold</label>
                <input
                  type="number"
                  name="lowThreshold"
                  value={form.lowThreshold}
                  onChange={handleChange}
                  min="1"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                />
              </div>
            </>
          )}

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
              className="rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}