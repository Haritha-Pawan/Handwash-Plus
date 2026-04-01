"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function UpdateStudent() {
  const router = useRouter();
  const { id } = useParams(); // student ID from the URL
  const [formData, setFormData] = useState({ regNo: "", name: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch student data on load
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students/${id}`);
        setFormData({ regNo: res.data.student.regNo, name: res.data.student.name });
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || "Failed to fetch student");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    setMessage("Name cannot be empty");
    return;
  }

  try {
    console.log("Sending update for ID:", id, "Name:", formData.name);
    await axios.put(`http://localhost:5000/api/students/${id}`, { name: formData.name });
    router.push("/teacher/students");
  } catch (err) {
    console.error("Update error:", err.response?.data || err.message);
    setMessage(err.response?.data?.message || "Failed to update student");
  }
};

  if (loading) return <div className="p-8 text-center">Loading student data...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">✏️ Update Student</h1>
      {message && <div className="text-red-500 mb-4">{message}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Reg. No</label>
          <input
            type="text"
            name="regNo"
            value={formData.regNo}
            disabled
            className="border px-3 py-1 rounded w-full bg-gray-100 cursor-not-allowed"
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
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Update Student
        </button>
      </form>
    </div>
  );
}