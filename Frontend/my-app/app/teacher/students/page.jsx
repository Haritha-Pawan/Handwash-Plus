"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classroomId, setClassroomId] = useState(null);

  // 1. Get classroomId
  useEffect(() => {
    const id = localStorage.getItem("classroomId");
    setClassroomId(id);
  }, []);

  // 2. Fetch only when classroomId exists
  useEffect(() => {
    if (!classroomId || classroomId === "null") return;

    const fetchStudents = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/students/by-classroom/${classroomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudents(res.data.students);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classroomId]);

  //  IMPORTANT: wait for classroomId
  if (!classroomId) {
    return (
      <div className="p-8 text-center text-red-500">
        No classroom selected. Please select a classroom first.
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center">Loading students...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">
          👩‍🎓 Student List
        </h1>

        <Link
          href="/teacher/students/Add"
          className="bg-blue-500 text-white px-3 py-1.5 rounded"
        >
          ➕ Add Student
        </Link>
      </div>

      <table className="w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">Reg No</th>
            <th className="p-2">Name</th>
            <th className="p-2">PIN</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="border-t">
              <td className="p-2">{student.regNo}</td>
              <td className="p-2">{student.name}</td>
              <td className="p-2">{student.pin}</td>

              <td className="p-2 flex gap-2">
                <Link
                  href={`/teacher/students/edit/${student._id}`}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={async () => {
                    await axios.delete(
                      `http://localhost:5000/api/students/${student._id}`,
                      {
                       headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                       },
                      }
                    );

                    setStudents((prev) =>
                      prev.filter((s) => s._id !== student._id)
                    );
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {students.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No students found
        </p>
      )}
    </div>
  );
}