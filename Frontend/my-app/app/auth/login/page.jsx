"use client";

import { useState } from "react";
import { loginUser } from "../../services/postServices/postService";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      // ✅ Save token
      localStorage.setItem("token", res.token);

      alert("Login successful");
      console.log(res);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
  >
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
      Welcome Back
    </h2>

    {/* Email */}
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-1">Email</label>
      <input
        name="email"
        placeholder="Enter your email"
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Password */}
    <div className="mb-2">
      <label className="block text-sm text-gray-600 mb-1">Password</label>
      <input
        name="password"
        type="password"
        placeholder="Enter your password"
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Forgot Password */}
    <div className="text-right mb-4">
      <button
        type="button"
        className="text-sm text-blue-600 hover:underline"
        onClick={() => alert("Redirect to forgot password page")}
      >
        Forgot Password?
      </button>
    </div>

    {/* Login Button */}
    <button className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white py-2.5 rounded-lg font-medium">
      Login
    </button>

    {/* Register Link */}
    <p className="text-sm text-center text-gray-500 mt-4">
      Don’t have an account?{" "}
      <span
        className="text-blue-600 cursor-pointer hover:underline"
        onClick={() => window.location.href = "/auth/register"}
      >
        Register
      </span>
    </p>
  </form>
</div>
  );
}