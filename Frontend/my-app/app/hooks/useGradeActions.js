"use client";

import { useState } from "react";
import {
  createIndividualGrade,
  updateGrade,
  deactivateGrade,
  checkSanitizerAndAlert,
  distributeBottles,
} from "../services/grade.service";

export default function useGradeActions(refetch) {
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreate = async (payload) => {
    try {
      setActionLoading(true);
      setActionError("");
      setSuccessMessage("");

      const res = await createIndividualGrade(payload);
      setSuccessMessage(res?.message || "Grade created successfully");
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

      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
      );

      const res = await updateGrade(gradeId, cleanedPayload);
      setSuccessMessage(res?.message || "Grade updated successfully");
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

      const res = await deactivateGrade(gradeId);
      setSuccessMessage(res?.message || "Grade deactivated successfully");
      await refetch();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to deactivate grade");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckSanitizer = async () => {
    try {
      setActionLoading(true);
      setActionError("");
      setSuccessMessage("");

      const res = await checkSanitizerAndAlert();
      setSuccessMessage(res?.message || "Sanitizer alert sent successfully");
      await refetch();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to check sanitizer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDistribute = async (gradeId, payload) => {
    try {
      setActionLoading(true);
      setActionError("");
      setSuccessMessage("");

      const res = await distributeBottles(gradeId, payload);
      const { classroomsUpdated, totalDeducted, remainingGradeStock } = res?.data || {};
      setSuccessMessage(
        res?.message ||
          `Distributed to ${classroomsUpdated} classroom(s). Deducted: ${totalDeducted}, Remaining: ${remainingGradeStock}`
      );
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
    handleCheckSanitizer,
    handleDistribute,
  };
}