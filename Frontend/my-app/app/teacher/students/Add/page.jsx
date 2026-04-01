"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddStudent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ regNo: "", name: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/students", formData);
      router.push("/teacher/students"); // Go back to student list
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to add student");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">➕ Add Student</h1>
      {message && <div className="text-red-500 mb-4">{message}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Reg. No</label>
          <input
            type="text"
            name="regNo"
            value={formData.regNo}
            onChange={handleChange}
            className="border px-3 py-1 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border px-3 py-1 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Student
        </button>
      </form>
    </div>
  );
}