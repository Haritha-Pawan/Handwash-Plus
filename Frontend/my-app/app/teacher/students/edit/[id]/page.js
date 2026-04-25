"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/axios";
import { useRouter, useParams } from "next/navigation";

export default function UpdateStudent() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({ regNo: "", name: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH STUDENT
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${id}`);

        setFormData({
          regNo: res.data.student.regNo,
          name: res.data.student.name,
        });
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

  // UPDATE STUDENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/students/${id}`, { name: formData.name });

      router.push("/teacher/students");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update student");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">Loading student data...</div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">✏️ Update Student</h1>

      {message && <div className="text-red-500 mb-4">{message}</div>}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-4 rounded shadow"
      >
        <div>
          <label>Reg. No</label>
          <input
            type="text"
            value={formData.regNo}
            disabled
            className="border px-3 py-1 rounded w-full bg-gray-100"
          />
        </div>

        <div>
          <label>Name</label>
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
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Update Student
        </button>
      </form>
    </div>
  );
}