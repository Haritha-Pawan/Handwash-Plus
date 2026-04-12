"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation"; 

function UpdateClassroomBottlesContent() {
  const params = useSearchParams();
  const router = useRouter(); 

  const classroomId = params.get("classroomId");
  const month = params.get("month");
  const distributed = Number(params.get("distributed"));
  const usedParam = Number(params.get("used") || 0);

  const [bottleUsed, setBottleUsed] = useState(usedParam);
  const [remaining, setRemaining] = useState(distributed - usedParam);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const rem = distributed - bottleUsed;
    setRemaining(rem >= 0 ? rem : 0);
  }, [bottleUsed, distributed]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/classroomsBottles/update",
        {
          classroomId,
          month,
          bottleUsed: Number(bottleUsed),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Bottles updated successfully!");

      // Redirect to the list after 1 second
      setTimeout(() => {
        router.push(`/teacher/classroom-bottles/view`); 
      }, 1000);

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
           Update Bottles
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Month</label>
            <input
              type="text"
              value={month || ""}
              disabled
              className="w-full border p-2 rounded mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Distributed Bottles</label>
            <input
              type="number"
              value={distributed || 0}
              disabled
              className="w-full border p-2 rounded mt-1 bg-blue-50 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bottles Used</label>
            <input
              type="number"
              value={bottleUsed}
              onChange={(e) => setBottleUsed(Number(e.target.value))}
              className="w-full border p-2 rounded mt-1"
              min={0}
              max={distributed || 0}
              required
            />
          </div>

          <div className="bg-green-50 p-3 rounded text-sm text-center">
             Remaining Bottles:{" "}
            <strong className="text-green-600 text-lg">{remaining}</strong>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
             Update Bottles
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm font-medium">{message}</div>
        )}
      </div>
    </div>
  );
}

export default function UpdateClassroomBottles() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <UpdateClassroomBottlesContent />
    </Suspense>
  );
}