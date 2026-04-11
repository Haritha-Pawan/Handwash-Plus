"use client";

import { useEffect, useState } from "react";

function Field({ label, hint, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        {hint && <span className="text-xs text-slate-500 font-medium">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default function GradeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "create",
  loading = false,
}) {
  const [form, setForm] = useState({
    gradeNumber: "",
    studentCount: "",
    lowThreshold: "",
    currentQuantity: "",
  });

  useEffect(() => {
    if (initialData && mode === "edit") {
      setForm({
        gradeNumber: "",
        studentCount: initialData.studentCount ?? "",
        lowThreshold: initialData?.sanitizer?.lowThreshold ?? "",
        currentQuantity: initialData?.sanitizer?.currentQuantity ?? "",
      });
    } else {
      setForm({ gradeNumber: "", studentCount: "", lowThreshold: "", currentQuantity: "" });
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "create") {
      onSubmit({
        gradeNumber: Number(form.gradeNumber),
        studentCount: form.studentCount === "" ? undefined : Number(form.studentCount),
        lowThreshold: form.lowThreshold === "" ? undefined : Number(form.lowThreshold),
      });
      return;
    }
    onSubmit({
      studentCount: form.studentCount === "" ? undefined : Number(form.studentCount),
      lowThreshold: form.lowThreshold === "" ? undefined : Number(form.lowThreshold),
      currentQuantity: form.currentQuantity === "" ? undefined : Number(form.currentQuantity),
    });
  };

    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === "create" ? "Create Grade" : `Edit Grade ${initialData?.gradeNumber ?? ""}`}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {mode === "create"
                ? "Add a new grade to your school"
                : "Update grade sanitizer or student details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {mode === "create" && (
            <Field label="Grade Number" hint="1 – 13">
              <input
                type="number"
                name="gradeNumber"
                value={form.gradeNumber}
                onChange={handleChange}
                min="1"
                max="13"
                required
                placeholder="e.g. 5"
                className={inputClass}
              />
            </Field>
          )}

          <Field label="Student Count" hint="optional">
            <input
              type="number"
              name="studentCount"
              value={form.studentCount}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 35"
              className={inputClass}
            />
          </Field>

          <Field label="Low Stock Threshold" hint="ml — triggers alert below this">
            <input
              type="number"
              name="lowThreshold"
              value={form.lowThreshold}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 100"
              className={inputClass}
            />
          </Field>

          {mode === "edit" && (
            <Field label="Current Sanitizer Quantity" hint="ml">
              <input
                type="number"
                name="currentQuantity"
                value={form.currentQuantity}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 250"
                className={inputClass}
              />
            </Field>
          )}

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
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60 transition-colors"
            >
              {loading ? "Saving..." : mode === "create" ? "Create Grade" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}