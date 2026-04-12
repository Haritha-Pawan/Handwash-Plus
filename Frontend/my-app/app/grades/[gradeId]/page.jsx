"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getGradeById, distributeBottles } from "../../services/grade.service";
import Loader from "../../components/grades/Loader";
import SanitizerStatusBadge from "../../components/grades/SanitizerStatusBadge";
import DistributeBottlesModal from "../../components/grades/DistributeBottlesModal";

const STATUS_CONFIG = {
  empty:    { track: "#f43f5e", bg: "bg-rose-50",    border: "border-rose-200",   text: "text-rose-700",    icon: "🔴", label: "Empty"    },
  critical: { track: "#f97316", bg: "bg-orange-50",  border: "border-orange-200", text: "text-orange-700",  icon: "🟠", label: "Critical"  },
  low:      { track: "#facc15", bg: "bg-yellow-50",  border: "border-yellow-200", text: "text-yellow-700",  icon: "🟡", label: "Low"      },
  adequate: { track: "#10b981", bg: "bg-emerald-50", border: "border-emerald-200",text: "text-emerald-700", icon: "🟢", label: "Adequate" },
};

function SanitizerGauge({ currentQty, threshold, unit, status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.adequate;
  const safeThreshold = threshold > 0 ? threshold : 1;
  const percent = Math.min(100, Math.max(0, (currentQty / safeThreshold) * 100));
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="14" />
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={cfg.track}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 80 80)"
            style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-800">{currentQty}</span>
          <span className="text-xs font-medium text-slate-500">{unit}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-slate-500">of {threshold} {unit} threshold</p>
        <p className="mt-0.5 text-sm font-bold" style={{ color: cfg.track }}>
          {Math.round(percent)}% remaining
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, icon, children, bg = "bg-white", border = "border-slate-200", labelClass = "text-slate-500" }) {
  return (
    <div className={`rounded-2xl border ${border} ${bg} p-5 flex flex-col justify-between min-h-[120px]`}>
      <div className="flex items-center justify-between mb-3">
        <p className={`text-xs font-semibold uppercase tracking-wider ${labelClass}`}>{label}</p>
        <span className="text-xl leading-none">{icon}</span>
      </div>
      {children}
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

  useEffect(() => { fetchGrade(); }, [gradeId]);

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
        <Link href="/grades" className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors">
          ← Back to Grades
        </Link>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 flex items-center gap-3">
          <span>⚠️</span>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (!grade) return null;

  const status = grade?.sanitizer?.status || "adequate";
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.adequate;
  const currentQty = grade?.sanitizer?.currentQuantity ?? 0;
  const threshold = grade?.sanitizer?.lowThreshold ?? 100;
  const unit = grade?.sanitizer?.unit || "ml";
  const safeThreshold = threshold > 0 ? threshold : 1;
  const percent = Math.round(Math.min(100, Math.max(0, (currentQty / safeThreshold) * 100)));
  const lastUpdatedAt = grade?.sanitizer?.lastUpdatedAt
    ? new Date(grade.sanitizer.lastUpdatedAt).toLocaleString()
    : null;
  const lastUpdatedBy = grade?.sanitizer?.lastUpdatedBy?.name || null;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/grades"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
      >
        ← Back to Grades
      </Link>

      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Grade {grade.gradeNumber}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <SanitizerStatusBadge status={status} />
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
              grade.isActive
                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-500 border-slate-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${grade.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
              {grade.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <button
          onClick={() => { setDistributeError(""); setDistributeSuccess(""); setDistributeOpen(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 active:scale-95 transition-all"
        >
          🧴 Distribute Bottles
        </button>
      </div>

      {/* Alerts */}
      {distributeSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 flex items-center gap-3">
          <span className="font-bold">✓</span>
          <span className="text-sm">{distributeSuccess}</span>
        </div>
      )}
      {distributeError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 flex items-center gap-3">
          <span>⚠️</span>
          <span className="text-sm">{distributeError}</span>
        </div>
      )}

      {/* Status banner */}
      <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} px-5 py-4 flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cfg.icon}</span>
          <div>
            <p className={`text-sm font-semibold ${cfg.text}`}>Sanitizer {cfg.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentQty} {unit} available · {threshold} {unit} threshold
            </p>
          </div>
        </div>
        <div className={`text-right`}>
          <p className={`text-3xl font-bold ${cfg.text}`}>{percent}%</p>
          <p className="text-xs text-slate-400">remaining</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-5 lg:grid-cols-3 items-stretch">
        {/* Gauge card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center justify-center gap-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sanitizer Level</p>
          <SanitizerGauge currentQty={currentQty} threshold={threshold} unit={unit} status={status} />
        </div>

        {/* 2×2 stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard label="Students" icon="👥" bg="bg-sky-50" border="border-sky-100" labelClass="text-sky-600">
            <p className="text-3xl font-bold text-sky-700">{grade.studentCount ?? 0}</p>
          </StatCard>

          <StatCard label="Low Threshold" icon="⚠️" bg="bg-amber-50" border="border-amber-100" labelClass="text-amber-600">
            <p className="text-3xl font-bold text-amber-700">
              {threshold}
              <span className="ml-1 text-sm font-normal text-amber-500">{unit}</span>
            </p>
          </StatCard>

          <StatCard label="Current Qty" icon="🧴" bg={cfg.bg} border={cfg.border} labelClass={cfg.text}>
            <p className={`text-3xl font-bold ${cfg.text}`}>
              {currentQty}
              <span className="ml-1 text-sm font-normal opacity-70">{unit}</span>
            </p>
          </StatCard>

          <StatCard label="Status" icon="📊">
            <div className="mt-1">
              <SanitizerStatusBadge status={status} />
            </div>
          </StatCard>
        </div>
      </div>

      {/* Last updated */}
      {(lastUpdatedAt || lastUpdatedBy) && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 flex items-center gap-3">
          <span className="text-lg">🕐</span>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</p>
            <p className="text-sm text-slate-700 mt-0.5">
              {lastUpdatedAt}
              {lastUpdatedBy && <span className="text-slate-400"> · by {lastUpdatedBy}</span>}
            </p>
          </div>
        </div>
      )}

      {/* Grade ID */}
      <p className="text-xs text-slate-400 break-all select-all">ID: {grade._id}</p>

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
