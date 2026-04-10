"use client";

import { useCallback, useEffect, useState } from "react";
import { getGrades } from "../services/grade.service";

export default function useGrades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGrades = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getGrades();
      setGrades(res?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  return {
    grades,
    setGrades,
    loading,
    error,
    refetch: fetchGrades,
  };
}