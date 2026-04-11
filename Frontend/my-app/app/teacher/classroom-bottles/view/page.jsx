"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ClassroomBottlesTable() {
  const [classroomId, setClassroomId] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Get classroomId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("classroomId");
    setClassroomId(id);
  }, []);

  // 2. Fetch data when classroomId is ready
  useEffect(() => {
    if (!classroomId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/classroomsBottles/${classroomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRecords(res.data.ClassroomBottles);
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classroomId]);

  const monthOrder = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const sortedRecords = [...records].sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  );

  if (loading) {
    return <div className="p-6 text-center text-lg">⏳ Loading...</div>;
  }

  if (!classroomId) {
    return (
      <div className="p-6 text-red-500">
        No classroom selected. Please select a classroom first.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        🧴 Classroom Bottles Overview
      </h1>

      {sortedRecords.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center text-gray-500">
          No data available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg shadow bg-white">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-left">Distributed</th>
                <th className="p-3 text-left">Used</th>
                <th className="p-3 text-left">Remaining</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {sortedRecords.map((rec, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{rec.month}</td>
                  <td className="p-3">{rec.bottleDistributed}</td>

                  <td className="p-3">
                    {rec.bottleUsed === 0 ? (
                      <span className="text-gray-400">0</span>
                    ) : (
                      rec.bottleUsed
                    )}
                  </td>

                  <td
                    className={`p-3 font-semibold ${
                      rec.bottleRemaining <= 10
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {rec.bottleRemaining}
                  </td>

                  <td className="p-3 text-center">
                    <Link
                      href={`/teacher/classroom-bottles/update?classroomId=${classroomId}&month=${rec.month}&distributed=${rec.bottleDistributed}&used=${rec.bottleUsed}`}
                    >
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow">
                         Update
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}