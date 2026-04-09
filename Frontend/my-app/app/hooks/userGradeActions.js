"use client";

import { useState } from "react";
import {
  createGrades,
  updateGrade,
  deactivateGrade,
  distributeBottles,
} from "../services/grade.service";

export default function useGradeActions(schoolId, refetch) {
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreate = async (payload) => {
    try {
      setActionLoading(true);
      setActionError("");
      setSuccessMessage("");
      const res = await createGrades(payload, schoolId);
      setSuccessMessage(res.message || "Grades created successfully");
      await refetch();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to create grades");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (gradeId, payload) => {
    try {
      setActionLoading(true);
      setActionError("");
      setSuccessMessage("");
      const cleaned = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
      );
      const res = await updateGrade(gradeId, cleaned, schoolId);
      setSuccessMessage(res.message || "Grade updated successfully");
      await refetch();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to update grade");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivate = async (gradeId) => {
    try {
      setActionLoading(true);
      setActionError("");
      setSuccessMessage("");
      const res = await deactivateGrade(gradeId, schoolId);
      setSuccessMessage(res.message || "Grade deactivated successfully");
      await refetch();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to deactivate grade");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDistribute = async (gradeId, payload) => {
    try {
      setActionLoading(true);
      setActionError("");
      setSuccessMessage("");
      const res = await distributeBottles(gradeId, payload, schoolId);
      setSuccessMessage(res.message || "Bottles distributed successfully");
      await refetch();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to distribute bottles");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionLoading,
    actionError,
    successMessage,
    setActionError,
    setSuccessMessage,
    handleCreate,
    handleUpdate,
    handleDeactivate,
    handleDistribute,
  };
}