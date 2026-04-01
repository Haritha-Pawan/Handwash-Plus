"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); 

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students");
        setStudents(res.data.students);
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading students...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">👩‍🎓 Student List</h1>
        <Link
          href="/teacher/students/Add"
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition text-sm"
        >
          ➕ Add Student
        </Link>
      </div>

      {/* Error / message */}
      {message && (
        <div className="text-center text-red-500 mb-4">{message}</div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow table-auto">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="py-2 px-6 border-b">Reg. No</th>
              <th className="py-2 px-6 border-b">Name</th>
              <th className="py-2 px-6 border-b">PIN</th>
              <th className="py-2 px-6 border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="py-2 px-6 border-b">{student.regNo}</td>
                <td className="py-2 px-6 border-b">{student.name}</td>
                <td className="py-2 px-6 border-b font-mono">{student.pin}</td>
                <td className="py-2 px-6 border-b flex gap-2">
                  {/* Edit button navigates to edit page */}
                  <Link
                    href={`/teacher/students/edit/${student._id}`}
                    className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    📝 Edit
                  </Link>

                  {/* Delete button triggers API call */}
                  <button
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    onClick={async () => {
                      if (
                        confirm(
                          `Are you sure you want to delete ${student.name}?`
                        )
                      ) {
                        try {
                          await axios.delete(
                            `http://localhost:5000/api/students/${student._id}`
                          );
                          setStudents((prev) =>
                            prev.filter((s) => s._id !== student._id)
                          );
                        } catch (err) {
                          console.error(err);
                          alert(
                            err.response?.data?.message ||
                              "Failed to delete student"
                          );
                        }
                      }
                    }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-4 text-gray-500 font-medium"
                >
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}