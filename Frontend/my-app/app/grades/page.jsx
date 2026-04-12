"use client";

import { useEffect, useMemo, useState } from "react";
import GradeStats from "../components/grades/GradeStats";
import GradeTable from "../components/grades/GradeTable";
import GradeFormModal from "../components/grades/GradeFormModal";
import ConfirmDeactivateModal from "../components/grades/confirmDeactivateModal";
import DistributeBottlesModal from "../components/grades/DistributeBottlesModal";
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
    if (!token) {
      window.location.href = "/login";
    }
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
    handleDistribute,
  } = useGradeActions(refetch);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [deactivatingGrade, setDeactivatingGrade] = useState(null);
  const [distributingGrade, setDistributingGrade] = useState(null);

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

  if (!ready) return <Loader text="Checking session..." />;
  if (!hasToken) return <Loader text="Redirecting to login..." />;

  return (
    <div className="space-y-6">
      <GradeStats stats={stats} />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            closeMessages();
            setIsCreateOpen(true);
          }}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
          disabled={actionLoading}
        >
          + Create Grade
        </button>

        <button
            onClick={() => {
              clearAuthToken();
              clearAuthUser();
              window.location.href = "/login";
            }}
            className="rounded-xl border border-white/10 px-5 py-3 text-black hover:bg-white/5 transition-colors"
          >
            Logout
          </button>
      </div>

      {successMessage && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-300 flex items-start gap-2">
          <span className="mt-0.5">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {actionError && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-300">
          {actionError}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-300">
          {error}
        </div>
      )}

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
          onDistribute={(grade) => {
            closeMessages();
            setDistributingGrade(grade);
          }}
        />
      )}

      {/* Create Modal */}
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

      {/* Edit Modal */}
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

      {/* Deactivate Confirm Modal */}
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

      {/* Distribute Bottles Modal */}
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
    </div>
  );
}