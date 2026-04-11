"use client";

import { useState } from "react";
import Link from "next/link";
import SanitizerStatusBadge from "./SanitizerStatusBadge";
import SanitizerFillBar from "./SanitizerFillBar";

export default function GradeTable({ grades, onEdit, onDeactivate, onDistribute }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = grades.filter((grade) => {
    const name = `grade ${grade.gradeNumber}`.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const gradeStatus = grade?.sanitizer?.status || "adequate";
    const matchesStatus = statusFilter === "all" || gradeStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "adequate", label: "Adequate" },
    { value: "low", label: "Low" },
    { value: "critical", label: "Critical" },
    { value: "empty", label: "Empty" },
  ];

  return (
    <div className="space-y-4">
      {/* Search + Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search grade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
        />
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === opt.value
                  ? "bg-sky-600 text-white shadow-md shadow-sky-500/20"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {filtered.length !== grades.length && (
          <span className="text-xs text-slate-500">
            {filtered.length} of {grades.length} grades
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-900">
            <thead className="bg-slate-50 text-left text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3">Sanitizer Level</th>
                <th className="px-4 py-3">Threshold</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No grades match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((grade) => {
                  const status = grade?.sanitizer?.status || "adequate";
                  const isUrgent = status === "empty" || status === "critical";
                  return (
                    <tr
                      key={grade._id}
                      className={`border-t border-slate-100 transition-colors ${
                        isUrgent
                          ? "bg-rose-50/50 animate-pulse-subtle"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {isUrgent && (
                            <span className="inline-block h-2 w-2 rounded-full bg-rose-500 animate-ping-slow" />
                          )}
                          Grade {grade.gradeNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{grade.studentCount ?? 0}</td>
                      <td className="px-4 py-3">
                        <SanitizerFillBar
                          currentQty={grade?.sanitizer?.currentQuantity ?? 0}
                          threshold={grade?.sanitizer?.lowThreshold ?? 100}
                          unit={grade?.sanitizer?.unit || "ml"}
                          status={status}
                        />
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {grade?.sanitizer?.lowThreshold ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <SanitizerStatusBadge status={status} />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold ${
                            grade.isActive ? "text-emerald-600" : "text-slate-500"
                          }`}
                        >
                          {grade.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/grades/${grade._id}`}
                            className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-sky-100 transition-colors shadow-sm"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => onEdit(grade)}
                            className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-yellow-100 transition-colors shadow-sm"
                          >
                            Edit
                          </button>
                          {onDistribute && (
                            <button
                              onClick={() => onDistribute(grade)}
                              className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-violet-100 transition-colors shadow-sm"
                            >
                              Distribute
                            </button>
                          )}
                          <button
                            onClick={() => onDeactivate(grade)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-rose-100 transition-colors shadow-sm"
                          >
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline keyframes injected as a style tag */}
      <style>{`
        @keyframes ping-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.6); }
        }
        .animate-ping-slow {
          animation: ping-slow 1.8s ease-in-out infinite;
        }
        @keyframes pulse-subtle {
          0%, 100% { background-color: rgb(255 241 242 / 0.5); }
          50% { background-color: rgb(255 241 242 / 0.82); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}