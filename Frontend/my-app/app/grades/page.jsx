"use client";

import { useEffect, useMemo, useState } from "react";
import GradeStats from "../components/grades/GradeStats";
import GradeTable from "../components/grades/GradeTable";
import GradeFormModal from "../components/grades/GradeFormModal";
import ConfirmDeactivateModal from "../components/grades/ConfirmDeactivateModal";
import Loader from "../components/grades/Loader";
import EmptyState from "../components/grades/EmptyState";
import useGrades from "../hooks/useGrades";
import useGradeActions from "../hooks/useGradeActions";
import {
  clearAuthToken,
  clearAuthUser,
  getAuthToken,
} from "../lib/auth";

export default function GradesPage() {
  const [ready, setReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    setHasToken(!!token);
    setReady(true);
  }, []);

  const { grades, loading, error, refetch } = useGrades();

  const {
    actionLoading,
    actionError,
    successMessage,
    setActionError,
    setSuccessMessage,
    handleCreate,
    handleUpdate,
    handleDeactivate,
  } = useGradeActions(refetch);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
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

  if (!ready) {
    return <Loader text="Checking session..." />;
  }

  if (!hasToken) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-6 text-yellow-200">
          Please log in first using the temporary login page at <span className="font-semibold">/temp-login</span>.
        </div>
      </div>
    );
  }

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

        <button
          onClick={() => {
            clearAuthToken();
            clearAuthUser();
            window.location.href = "/temp-login";
          }}
          className="rounded-xl border border-white/10 px-5 py-3 text-slate-200"
        >
          Logout
        </button>
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
          subtitle="Create grades to start managing grade records."
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