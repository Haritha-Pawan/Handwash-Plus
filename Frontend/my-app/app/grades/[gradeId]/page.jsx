"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getGradeById } from "../../services/grade.service";
import Loader from "../../components/grades/Loader";
import SanitizerStatusBadge from "../../components/grades/SanitizerStatusBadge";

export default function GradeDetailsPage({ params }) {
  const { gradeId } = use(params);

  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchGrade();
  }, [gradeId]);

  if (loading) {
    return <Loader text="Loading grade details..." />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-300">
        {error}
      </div>
    );
  }

  if (!grade) return null;

  return (
    <div className="space-y-6">
      <Link href="/grades" className="inline-block text-sm text-sky-300">
        ← Back to Grades
      </Link>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-bold text-white">Grade {grade.gradeNumber}</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Student Count</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {grade.studentCount ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Current Quantity</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {grade?.sanitizer?.currentQuantity ?? 0} {grade?.sanitizer?.unit || "ml"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Low Threshold</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {grade?.sanitizer?.lowThreshold ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Status</p>
            <div className="mt-2">
              <SanitizerStatusBadge status={grade?.sanitizer?.status || "adequate"} />
            </div>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Active</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {grade.isActive ? "Yes" : "No"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-sm text-slate-400">Grade ID</p>
            <p className="mt-2 break-all text-sm font-medium text-white">
              {grade._id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}