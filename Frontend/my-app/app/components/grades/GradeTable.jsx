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
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-500/50 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === opt.value
                  ? "bg-sky-600 text-white shadow-md shadow-sky-500/20"
                  : "border border-white/10 bg-slate-900 text-slate-400 hover:border-white/20 hover:text-white"
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
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-slate-800/80 text-left text-slate-400 text-xs uppercase tracking-wider">
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
                      className={`border-t border-white/10 transition-colors ${
                        isUrgent
                          ? "bg-rose-950/20 animate-pulse-subtle"
                          : "hover:bg-slate-800/30"
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
                      <td className="px-4 py-3 text-slate-300">{grade.studentCount ?? 0}</td>
                      <td className="px-4 py-3">
                        <SanitizerFillBar
                          currentQty={grade?.sanitizer?.currentQuantity ?? 0}
                          threshold={grade?.sanitizer?.lowThreshold ?? 100}
                          unit={grade?.sanitizer?.unit || "ml"}
                          status={status}
                        />
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {grade?.sanitizer?.lowThreshold ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <SanitizerStatusBadge status={status} />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium ${
                            grade.isActive ? "text-emerald-400" : "text-slate-500"
                          }`}
                        >
                          {grade.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/grades/${grade._id}`}
                            className="rounded-lg border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-300 hover:bg-sky-400/20 transition-colors"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => onEdit(grade)}
                            className="rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-300 hover:bg-yellow-400/20 transition-colors"
                          >
                            Edit
                          </button>
                          {onDistribute && (
                            <button
                              onClick={() => onDistribute(grade)}
                              className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs text-violet-300 hover:bg-violet-400/20 transition-colors"
                            >
                              Distribute
                            </button>
                          )}
                          <button
                            onClick={() => onDeactivate(grade)}
                            className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs text-rose-300 hover:bg-rose-400/20 transition-colors"
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
          0%, 100% { background-color: rgb(69 10 10 / 0.2); }
          50% { background-color: rgb(69 10 10 / 0.35); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}