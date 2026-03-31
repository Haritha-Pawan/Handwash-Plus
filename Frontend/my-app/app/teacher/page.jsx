"use client";

import Link from "next/link";

export default function TeacherQuizPage() {
  return (
    <div>
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quizzes</h1>

        {/* Create Quiz Button */}
        <Link href="/teacher/quiz/create">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded font-semibold">
            ➕ Create Quiz
          </button>
        </Link>
      </div>

      {/* Placeholder for quiz list */}
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        No quizzes available yet...
      </div>
    </div>
  );
}