"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "../src/features/auth/hooks/useAuth";
import { Droplets, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending, error, isError } = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData, {
      onSuccess: (response) => {
        if (response.success) {
          
           // const token = response.data.tokens.accessToken ;
           const token = response.data?.tokens?.accessToken ||(response as any)?.tokens?.accessToken || (response as any)?.data?.accessToken || (response as any)?.accessToken ;
            localStorage.setItem("token", token); 
            console.log("TOKEN AFTER LOGIN:", token);
            const role = response.data.user.role;
              localStorage.setItem("user", JSON.stringify(response.data.user));

          if (role === "superAdmin") {
            router.push("/dashboard");
          } else if (role === "teacher") {
            router.push("/teacher/classrooms");
           
            } else {
            // Handle non-superAdmin login if needed
            router.push("/");
          }
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-xl shadow-blue-200 mb-6 group hover:scale-110 transition-transform duration-300">
            <Droplets className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 font-medium">Log in to your CleanHands account</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 px-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all shadow-sm"
                  placeholder="admin@cleanhands.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 px-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isError && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 animate-shake">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-red-600">
                  {(error as any)?.response?.data?.message || "Invalid credentials. Please try again."}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center justify-center">
                {isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Log in"
                )}
              </span>
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-slate-500 font-medium">
          Forgot your password?{" "}
          <button className="text-cyan-600 hover:text-cyan-700 font-bold transition-colors">
            Contact Support
          </button>
        </p>
      </div>
    </div>
  );
}
