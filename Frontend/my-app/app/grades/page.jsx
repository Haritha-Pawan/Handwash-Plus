"use client";

import { useMemo, useState } from "react";
import GradeStats from "../components/grades/GradeStats";
import GradeTable from "../components/grades/GradeTable";
import GradeFormModal from "../components/grades/GradeFormModal";
import DistributeBottlesModal from "../components/grades/DistributeBottlesModal";
import ConfirmDeactivateModal from "../components/grades/confirmDeactivateModal";
import Loader from "../components/grades/Loader";
import EmptyState from "../components/grades/EmptyState";
import useGrades from "../hooks/useGrades";
import useGradeActions from "../hooks/userGradeActions";

export default function GradesPage() {
  const schoolId = null; // set schoolId here only if superAdmin frontend needs manual query param
  const { grades, loading, error, refetch } = useGrades(schoolId);

  const {
    actionLoading,
    actionError,
    successMessage,
    setActionError,
    setSuccessMessage,
    handleCreate,
    handleUpdate,
    handleDeactivate,
    handleDistribute,
  } = useGradeActions(schoolId, refetch);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [distributingGrade, setDistributingGrade] = useState(null);
  const [deactivatingGrade, setDeactivatingGrade] = useState(null);

  const stats = useMemo(() => {
    return {
      total: grades.length,
      active: grades.filter((g) => g.isActive).length,
      low: grades.filter((g) => g?.sanitizer?.status === "low").length,
      critical: grades.filter((g) =>
        ["critical", "empty"].includes(g?.sanitizer?.status)
      ).length,
    };
  }, [grades]);

  const closeMessages = () => {
    setActionError("");
    setSuccessMessage("");
  };

  return (
    <div className="space-y-6">
      <GradeStats stats={stats} />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            closeMessages();
            setIsCreateOpen(true);
          }}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-500"
        >
          + Create Grades
        </button>

        <a
          href="/sanitizer-report"
          className="rounded-xl border border-white/10 px-5 py-3 text-slate-200"
        >
          View Sanitizer Report
        </a>
      </div>

      {successMessage ? (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-300">
          {successMessage}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-300">
          {actionError}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Loader text="Loading grades..." />
      ) : grades.length === 0 ? (
        <EmptyState
          title="No grades found"
          subtitle="Create grades to start managing sanitizer stock."
        />
      ) : (
        <GradeTable
          grades={grades}
          onEdit={(grade) => {
            closeMessages();
            setEditingGrade(grade);
          }}
          onDeactivate={(grade) => {
            closeMessages();
            setDeactivatingGrade(grade);
          }}
          onDistribute={(grade) => {
            closeMessages();
            setDistributingGrade(grade);
          }}
        />
      )}

      <GradeFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        mode="create"
        loading={actionLoading}
        onSubmit={async (payload) => {
          await handleCreate(payload);
          setIsCreateOpen(false);
        }}
      />

      <GradeFormModal
        isOpen={!!editingGrade}
        onClose={() => setEditingGrade(null)}
        mode="edit"
        initialData={editingGrade}
        loading={actionLoading}
        onSubmit={async (payload) => {
          await handleUpdate(editingGrade._id, payload);
          setEditingGrade(null);
        }}
      />

      <DistributeBottlesModal
        isOpen={!!distributingGrade}
        onClose={() => setDistributingGrade(null)}
        grade={distributingGrade}
        loading={actionLoading}
        onSubmit={async (payload) => {
          await handleDistribute(distributingGrade._id, payload);
          setDistributingGrade(null);
        }}
      />

      <ConfirmDeactivateModal
        isOpen={!!deactivatingGrade}
        onClose={() => setDeactivatingGrade(null)}
        grade={deactivatingGrade}
        loading={actionLoading}
        onConfirm={async () => {
          await handleDeactivate(deactivatingGrade._id);
          setDeactivatingGrade(null);
        }}
      />
    </div>
  );
}