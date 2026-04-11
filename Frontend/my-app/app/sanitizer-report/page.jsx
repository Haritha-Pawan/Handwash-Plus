"use client";

import { useCallback, useEffect, useState } from "react";
import { checkSanitizerAndAlert } from "../services/grade.service";
import { getAuthToken } from "../lib/auth";
import Loader from "../components/grades/Loader";
import EmptyState from "../components/grades/EmptyState";
import SanitizerStatusBadge from "../components/grades/SanitizerStatusBadge";
import SanitizerFillBar from "../components/grades/SanitizerFillBar";
import Link from "next/link";

const STATUS_ORDER = ["empty", "critical", "low", "adequate"];

const summaryConfig = [
  {
    key: "empty",
    label: "Empty",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-300",
    value_text: "text-rose-400",
  },
  {
    key: "critical",
    label: "Critical",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-300",
    value_text: "text-orange-400",
  },
  {
    key: "low",
    label: "Low Stock",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-300",
    value_text: "text-yellow-400",
  },
  {
    key: "adequate",
    label: "Adequate",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-300",
    value_text: "text-emerald-400",
  },
];

export default function SanitizerReportPage() {
  // All hooks declared first — no early returns before this block
  const [ready, setReady] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("status");
  const [alertSent, setAlertSent] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      window.location.href = "/login";
    } else {
      setReady(true);
    }
  }, []);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await checkSanitizerAndAlert();
      setReport(res.data);
      setAlertSent(res.data?.summary?.alertSentViaSMS || false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load sanitizer report");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once ready
  useEffect(() => {
    if (ready) fetchReport();
  }, [ready, fetchReport]);

  const sortedDetails = report?.details
    ? [...report.details].sort((a, b) => {
        if (sortBy === "status") {
          return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
        }
        return a.quantity - b.quantity;
      })
    : [];

  // — Render guards —
  if (!ready) return <Loader text="Checking session..." />;
  if (loading) return <Loader text="Loading sanitizer report..." />;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Back + Header */}
        <Link
          href="/grades"
          className="inline-flex items-center gap-1 text-sm text-sky-300 hover:text-sky-200 transition-colors"
        >
          ← Back to Grades
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sanitizer Report</h1>
            <p className="mt-1 text-slate-400">
              {report?.schoolName && (
                <span className="font-medium text-white">{report.schoolName} — </span>
              )}
              {report?.timestamp && new Date(report.timestamp).toLocaleString()}
            </p>
          </div>
          <button
            onClick={fetchReport}
            disabled={loading}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
          >
            ↻ Refresh &amp; Alert
          </button>
        </div>

        {/* WhatsApp alert banner */}
        {alertSent && (
          <div className="rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sky-300 flex items-center gap-2">
            <span>📲</span>
            <span>WhatsApp alert sent to admin for critical/empty grades.</span>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-300">
            {error}
          </div>
        )}

        {!report ? (
          <EmptyState title="No report found" subtitle="Click Refresh & Alert to generate a report." />
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryConfig.map(({ key, label, icon, bg, border, text, value_text }) => (
                <div
                  key={key}
                  className={`rounded-2xl border ${border} ${bg} p-5 flex items-center gap-4`}
                >
                  <span className="text-3xl">{icon}</span>
                  <div>
                    <p className={`text-sm ${text}`}>{label}</p>
                    <p className={`text-4xl font-bold ${value_text}`}>
                      {report.summary[key] ?? 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sort controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Sort by:</span>
              {["status", "quantity"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                    sortBy === opt
                      ? "bg-sky-600 text-white"
                      : "border border-white/10 bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Detail table */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
              <table className="min-w-full text-sm text-white">
                <thead className="bg-slate-800/80 text-left text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Level</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDetails.map((item) => {
                    const isUrgent = item.status === "empty" || item.status === "critical";
                    return (
                      <tr
                        key={item.gradeNumber}
                        className={`border-t border-white/10 transition-colors ${
                          isUrgent ? "bg-rose-950/20" : "hover:bg-slate-800/30"
                        }`}
                      >
                        <td className="px-4 py-3 font-medium">
                          <div className="flex items-center gap-2">
                            {isUrgent && (
                              <span className="inline-block h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                            )}
                            Grade {item.gradeNumber}
                          </div>
                        </td>
                        <td className="px-4 py-3 min-w-[160px]">
                          <SanitizerFillBar
                            currentQty={item.quantity}
                            threshold={100}
                            unit={item.unit}
                            status={item.status}
                          />
                        </td>
                        <td className="px-4 py-3 text-slate-300">{item.quantity}</td>
                        <td className="px-4 py-3 text-slate-500">{item.unit}</td>
                        <td className="px-4 py-3">
                          <SanitizerStatusBadge status={item.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}