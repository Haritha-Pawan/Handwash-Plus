"use client";

import Link from "next/link";
import SanitizerStatusBadge from "./SanitizerStatusBadge";
import SanitizerFillBar from "./SanitizerFillBar";

export default function GradeTable({
  grades,
  meta,
  page,
  setPage,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onEdit,
  onDeactivate,
  onDistribute,
}) {
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
          placeholder="Search grade number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
        />
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setStatusFilter(opt.value);
                setPage(1); // Reset to first page when filter changes
              }}
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
        {grades.length > 0 && meta && meta.total !== grades.length && (
          <span className="text-xs text-slate-500">
            {grades.length} of {meta.total} grades
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
              {grades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No grades match your filter.
                  </td>
                </tr>
              ) : (
                grades.map((grade) => {
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

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= meta.totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing <span className="font-medium">{(page - 1) * meta.limit + 1}</span> to <span className="font-medium">{Math.min(page * meta.limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>
                {[...Array(meta.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    aria-current={page === i + 1 ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                      page === i + 1
                        ? "z-10 bg-sky-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                        : "text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= meta.totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

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