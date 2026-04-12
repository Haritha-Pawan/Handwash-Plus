"use client";

import { useState } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

export default function AddStudent() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const classroomId = localStorage.getItem("classroomId");

      if (!classroomId) {
        setMessage("No classroom selected");
        return;
      }

      await api.post("/students", {
        regNo: formData.regNo,
        name: formData.name,
        classroomId,
      });

      router.push("/teacher/students");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to add student");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">➕ Add Student</h1>

      {message && <div className="text-red-500 mb-4">{message}</div>}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-4 rounded shadow"
      >
        <div>
          <label>Reg. No</label>
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Student
        </button>
      </form>
    </div>
  );
}