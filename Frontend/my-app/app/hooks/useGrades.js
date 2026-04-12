"use client";

import { useCallback, useEffect, useState } from "react";
import { getGrades } from "../services/grade.service";

export default function useGrades() {
  const [grades, setGrades] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchGrades = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getGrades({ page, limit, search, statusFilter });
      // The backend returns ok(res, gradesData) so it's in res.data
      setGrades(res?.data?.items || []);
      setMeta(res?.data?.meta || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  return {
    grades,
    meta,
    loading,
    error,
    refetch: fetchGrades,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  };
}