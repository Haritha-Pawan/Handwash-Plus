"use client";

import { useState } from "react";
import { registerUser } from "../services/postServices/postService";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    school: "",
    className: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(form);
      alert("Registration successful");
      console.log(res);
    } catch (err) {
      console.error(err);
      alert("Error registering");
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl"
  >
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
      Create Account
    </h2>

    {/* Name */}
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-1">Name</label>
      <input
        name="name"
        placeholder="Enter your name"
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Email */}
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-1">Email</label>
      <input
        name="email"
        placeholder="Enter your email"
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Password */}
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-1">Password</label>
      <input
        name="password"
        type="password"
        placeholder="Enter password"
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* School */}
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-1">School</label>
      <input
        name="school"
        placeholder="Enter your school"
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Class */}
    <div className="mb-5">
      <label className="block text-sm text-gray-600 mb-1">Class</label>
      <input
        name="className"
        placeholder="Enter class"
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Button */}
    <button className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white py-2.5 rounded-lg font-medium">
      Register
    </button>

    {/* Footer */}
    <p className="text-sm text-center text-gray-500 mt-4">
      Already have an account?{" "}
      <span className="text-blue-600 cursor-pointer hover:underline">
        Login
      </span>
    </p>
  </form>
</div>
  );
}