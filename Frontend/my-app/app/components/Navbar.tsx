"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Droplets, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
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
            <a href="/" className="text-md font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">Home</a>
            <a href="#" className="text-md font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">Features</a>
            <a href="#" className="text-md font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">Monitoring</a>
            <a href="/community" className="text-md font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">Community</a>
            {user?.role === "superAdmin" && (
              <a href="/dashboard" className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors">Dashboard</a>
            )}
            <a href="#" className="text-md font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              // ── Profile icon + dropdown ──
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {/* User info */}
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      
                    </div>

                    {/* My Dashboard */}
                    <button
                      onClick={() => { router.push("/dashbord/my-posts"); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      My Dashboard
                    </button>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-cyan-700 transition-all font-bold shadow-lg"
                >
                  Log In
                </Button>
                <Button
                  onClick={() => router.push("/signup")}
                  variant="outline"
                  className="text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}