"use client";
import React, { useState, useEffect } from "react";
import { X, Save, Building, MapPin, Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

export function CreateSchoolModal({ onClose, onCreated }) {
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "",
    city: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsPending(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        lat: Number(formData.lat),
        lng: Number(formData.lng),
      };

      const response = await fetch(`${API_BASE_URL}/schools`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && (data.success || data.data || response.status === 201)) {
        onCreated();
        onClose();
      } else {
        setErrorMsg(data.message || "Failed to create school");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Server error");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Building className="w-5 h-5 mr-3" />
            Create New School
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              School Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. St. Mary's Primary School"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 123 Main Street"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Nairobi"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g. Westlands"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              Coordinates <span className="text-red-500 ml-1">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="-1.286389"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none font-mono text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="36.817223"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none font-mono text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center px-6 py-2.5 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isPending ? "Creating..." : "Create School"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
