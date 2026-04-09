"use client";

import Link from "next/link";
import SanitizerStatusBadge from "./SanitizerStatusBadge";

export default function GradeTable({
  grades,
  onEdit,
  onDeactivate,
  onDistribute,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-slate-800/80 text-left text-slate-300">
            <tr>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Students</th>
              <th className="px-4 py-3">Current Qty</th>
              <th className="px-4 py-3">Threshold</th>
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade._id} className="border-t border-white/10">
                <td className="px-4 py-3">Grade {grade.gradeNumber}</td>
                <td className="px-4 py-3">{grade.studentCount ?? 0}</td>
                <td className="px-4 py-3">
                  {grade?.sanitizer?.currentQuantity ?? 0} {grade?.sanitizer?.unit || "ml"}
                </td>
                <td className="px-4 py-3">{grade?.sanitizer?.lowThreshold ?? 0}</td>
                <td className="px-4 py-3">{grade?.classTeacher?.name || "Not assigned"}</td>
                <td className="px-4 py-3">
                  <SanitizerStatusBadge status={grade?.sanitizer?.status || "adequate"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/grades/${grade._id}`}
                      className="rounded-lg border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-300"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => onEdit(grade)}
                      className="rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDistribute(grade)}
                      className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"
                    >
                      Distribute
                    </button>
                    <button
                      onClick={() => onDeactivate(grade)}
                      className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs text-rose-300"
                    >
                      Deactivate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}