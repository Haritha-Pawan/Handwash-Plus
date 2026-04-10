"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios";
import {
  clearAuthToken,
  clearAuthUser,
  saveAuthToken,
  saveAuthUser,
} from "../lib/auth";

export default function TempLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [responsePreview, setResponsePreview] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponsePreview(null);

    try {
      clearAuthToken();
      clearAuthUser();

      const { data } = await api.post("/users/login/", {
        email: form.email,
        password: form.password,
      });

      setResponsePreview(data);

      const token =
        data?.token ||
        data?.data?.token ||
        data?.accessToken ||
        data?.data?.accessToken ||
        data?.jwt ||
        data?.data?.jwt;

      const user =
        data?.user ||
        data?.data?.user ||
        null;

      if (!token) {
        throw new Error("Token not found in login response");
      }

      saveAuthToken(token);

      if (user) {
        saveAuthUser(user);
      }

      router.push("/grades");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <h1 className="text-2xl font-bold">Temporary Login</h1>
        <p className="mt-2 text-sm text-slate-400">
          Login using the real backend so you can test the Grades frontend.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {responsePreview ? (
          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="mb-2 text-sm text-slate-400">Response Preview</p>
            <pre className="overflow-auto text-xs text-slate-200">
              {JSON.stringify(responsePreview, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}