"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getGradeById } from "../../services/grade.service";
import { distributeBottles } from "../../services/grade.service";
import Loader from "../../components/grades/Loader";
import SanitizerStatusBadge from "../../components/grades/SanitizerStatusBadge";
import DistributeBottlesModal from "../../components/grades/DistributeBottlesModal";

function SanitizerGauge({ currentQty, threshold, unit, status }) {
  const safeThreshold = threshold > 0 ? threshold : 1;
  const percent = Math.min(100, Math.max(0, (currentQty / safeThreshold) * 100));

  const trackColor =
    status === "empty"
      ? "#f43f5e"
      : status === "critical"
      ? "#f97316"
      : status === "low"
      ? "#facc15"
      : "#10b981";

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Background track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
          />
          {/* Animated fill */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 70 70)"
            style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{currentQty}</span>
          <span className="text-xs text-slate-400">{unit}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-500">of {threshold} {unit} threshold</p>
        <p className="mt-1 text-sm font-semibold" style={{ color: trackColor }}>
          {Math.round(percent)}% remaining
        </p>
      </div>
    </div>
  );
}

export default function GradeDetailsPage({ params }) {
  const { gradeId } = use(params);

  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [distributeOpen, setDistributeOpen] = useState(false);
  const [distributeLoading, setDistributeLoading] = useState(false);
  const [distributeError, setDistributeError] = useState("");
  const [distributeSuccess, setDistributeSuccess] = useState("");

  const fetchGrade = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getGradeById(gradeId);
      setGrade(res?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load grade details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrade();
  }, [gradeId]);

  const handleDistribute = async (payload) => {
    try {
      setDistributeLoading(true);
      setDistributeError("");
      setDistributeSuccess("");
      const res = await distributeBottles(gradeId, payload);
      const d = res?.data || {};
      setDistributeSuccess(
        `Distributed to ${d.classroomsUpdated} classroom(s). Deducted: ${d.totalDeducted}, Remaining: ${d.remainingGradeStock} ${grade?.sanitizer?.unit || "ml"}`
      );
      setDistributeOpen(false);
      await fetchGrade();
    } catch (err) {
      setDistributeError(err?.response?.data?.message || "Distribution failed");
    } finally {
      setDistributeLoading(false);
    }
  };

  if (loading) return <Loader text="Loading grade details..." />;

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/grades" className="inline-block text-sm text-sky-300">
          ← Back to Grades
        </Link>
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-300">
          {error}
        </div>
      </div>
    );
  }

  if (!grade) return null;

  const status = grade?.sanitizer?.status || "adequate";
  const currentQty = grade?.sanitizer?.currentQuantity ?? 0;
  const threshold = grade?.sanitizer?.lowThreshold ?? 100;
  const unit = grade?.sanitizer?.unit || "ml";
  const lastUpdatedAt = grade?.sanitizer?.lastUpdatedAt
    ? new Date(grade.sanitizer.lastUpdatedAt).toLocaleString()
    : null;
  const lastUpdatedBy = grade?.sanitizer?.lastUpdatedBy?.name || null;

  return (
    <div className="space-y-6">
      <Link
        href="/grades"
        className="inline-flex items-center gap-1 text-sm text-sky-300 hover:text-sky-200 transition-colors"
      >
        ← Back to Grades
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">Grade {grade.gradeNumber}</h2>
          <SanitizerStatusBadge status={status} />
          <span
            className={`text-xs font-medium ${
              grade.isActive ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            {grade.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <button
          onClick={() => {
            setDistributeError("");
            setDistributeSuccess("");
            setDistributeOpen(true);
          }}
          className="rounded-xl border border-violet-400/30 bg-violet-400/10 px-5 py-2.5 text-sm text-violet-300 hover:bg-violet-400/20 transition-colors"
        >
          🧴 Distribute Bottles
        </button>
      </div>

      {/* Success / Error banners */}
      {distributeSuccess && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-300 flex items-start gap-2">
          <span>✓</span>
          <span>{distributeSuccess}</span>
        </div>
      )}
      {distributeError && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-300">
          {distributeError}
        </div>
      )}

      {/* Main cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sanitizer Gauge */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 flex flex-col items-center justify-center gap-2">
          <p className="text-sm font-medium text-slate-400 mb-2">Sanitizer Level</p>
          <SanitizerGauge
            currentQty={currentQty}
            threshold={threshold}
            unit={unit}
            status={status}
          />
        </div>

        {/* Info Grid */}
        <div className="md:col-span-2 grid gap-4 grid-cols-2">
          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Students</p>
            <p className="text-2xl font-bold text-white">{grade.studentCount ?? 0}</p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Low Threshold</p>
            <p className="text-2xl font-bold text-white">
              {threshold} <span className="text-sm font-normal text-slate-400">{unit}</span>
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Qty</p>
            <p className="text-2xl font-bold text-white">
              {currentQty} <span className="text-sm font-normal text-slate-400">{unit}</span>
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
            <div className="mt-1">
              <SanitizerStatusBadge status={status} />
            </div>
          </div>

          {(lastUpdatedAt || lastUpdatedBy) && (
            <div className="rounded-xl bg-slate-800/60 p-4 col-span-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Last Updated</p>
              <p className="text-sm text-white">
                {lastUpdatedAt}
                {lastUpdatedBy && (
                  <span className="text-slate-400"> by {lastUpdatedBy}</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Grade ID (subtle) */}
      <p className="text-xs text-slate-600 break-all">ID: {grade._id}</p>

      {/* Distribute Modal */}
      <DistributeBottlesModal
        isOpen={distributeOpen}
        onClose={() => setDistributeOpen(false)}
        grade={grade}
        loading={distributeLoading}
        onSubmit={handleDistribute}
      />
    </div>
  );
}