"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Droplets, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CleanHands</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-cyan-600 transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-cyan-600 transition-colors">Features</a>
            <a href="#" className="text-gray-700 hover:text-cyan-600 transition-colors">Monitoring</a>
            <a href="/community" className="text-gray-700 hover:text-cyan-600 transition-colors">Community</a>
            {user?.role === "superAdmin" && (
              <a href="/dashboard" className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors">Dashboard</a>
            )}
            <a href="#" className="text-gray-700 hover:text-cyan-600 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900">{user.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                className="bg-cyan-600 text-white px-6 py-2.5 rounded-xl hover:bg-cyan-700 transition-all font-bold shadow-lg shadow-cyan-200"
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
