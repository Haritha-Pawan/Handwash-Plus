"use client";

import { useEffect, useState } from "react";
import { checkSanitizerAndAlert } from "../services/grade.service";
import Loader from "../components/grades/Loader";
import EmptyState from "../components/grades/EmptyState";
import SanitizerStatusBadge from "../components/grades/SanitizerStatusBadge";
import Link from "next/link";

export default function SanitizerReportPage() {
  const schoolId = null;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await checkSanitizerAndAlert(schoolId);
        setReport(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load sanitizer report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <Loader text="Loading sanitizer report..." />;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/grades" className="inline-block text-sm text-sky-300">
          ← Back to Grades
        </Link>

        <div>
          <h1 className="text-3xl font-bold">Sanitizer Report</h1>
          <p className="mt-2 text-slate-400">
            View grade-wise sanitizer status summary
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-300">
            {error}
          </div>
        ) : null}

        {!report ? (
          <EmptyState title="No report found" />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">Empty</p>
                <p className="mt-2 text-3xl font-bold text-white">{report.summary.empty}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">Critical</p>
                <p className="mt-2 text-3xl font-bold text-white">{report.summary.critical}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">Low</p>
                <p className="mt-2 text-3xl font-bold text-white">{report.summary.low}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">Adequate</p>
                <p className="mt-2 text-3xl font-bold text-white">{report.summary.adequate}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
              <table className="min-w-full text-sm text-white">
                <thead className="bg-slate-800/80 text-left text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.details.map((item) => (
                    <tr key={item.gradeNumber} className="border-t border-white/10">
                      <td className="px-4 py-3">Grade {item.gradeNumber}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">{item.unit}</td>
                      <td className="px-4 py-3">
                        <SanitizerStatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}