"use client";

import Link from "next/link";

export default function TeacherQuizPage() {
  return (
    <div className="p-6">
      {/* Header + Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quizzes</h1>

        {/* Create Quiz Button */}
        <Link href="/teacher/quiz/create">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded font-semibold">
            ➕ Create Quiz
          </button>
        </Link>
      </div>

      {/* Quiz List Placeholder */}
      <div className="bg-white p-6 rounded shadow-md space-y-4">
        {/* Example of quiz row */}
        <div className="flex justify-between items-center border-b pb-2">
          <span>Sample Quiz 1</span>
          <div className="space-x-2">
            <button className="text-blue-500 font-semibold hover:underline">
              Edit
            </button>
            <button className="text-red-500 font-semibold hover:underline">
              Delete
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span>Sample Quiz 2</span>
          <div className="space-x-2">
            <button className="text-blue-500 font-semibold hover:underline">
              Edit
            </button>
            <button className="text-red-500 font-semibold hover:underline">
              Delete
            </button>
          </div>
        </div>

        {/* Placeholder message if no quizzes */}
        <div className="text-gray-500 text-center py-4">
          No more quizzes yet. Click "Create Quiz" to add one!
        </div>
      </div>
    </div>
  );
}