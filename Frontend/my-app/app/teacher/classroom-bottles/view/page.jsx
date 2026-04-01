"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ClassroomBottlesTable() {
  const classroomId = "699c1b8f7d82290b85e8bdd9"; // TODO: make dynamic later

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/classroomsBottles/${classroomId}`
      );

      setRecords(res.data.ClassroomBottles);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Optional: sort months properly
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

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        🧴 Classroom Bottles Overview
      </h1>

      {/* Empty state */}
      {records.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center text-gray-500">
          No data available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg shadow bg-white">
            {/* Table Head */}
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-left">Distributed</th>
                <th className="p-3 text-left">Used</th>
                <th className="p-3 text-left">Remaining</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {sortedRecords.map((rec, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Month */}
                  <td className="p-3 font-medium">{rec.month}</td>

                  {/* Distributed */}
                  <td className="p-3">{rec.bottleDistributed}</td>

                  {/* Used */}
                  <td className="p-3">
                    {rec.bottleUsed === 0 ? (
                      <span className="text-gray-400">0</span>
                    ) : (
                      rec.bottleUsed
                    )}
                  </td>

                  {/* Remaining */}
                  <td
                    className={`p-3 font-semibold ${
                      rec.bottleRemaining <= 10
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {rec.bottleRemaining}
                  </td>

                  {/* Action */}
                  <td className="p-3 text-center">
                    <Link
                      href={`/teacher/classroom-bottles/update?classroomId=${classroomId}&month=${rec.month}&distributed=${rec.bottleDistributed}&used=${rec.bottleUsed}`}
                    >
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow">
                        ✏️ Update
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