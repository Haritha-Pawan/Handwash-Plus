"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "../../lib/axios";

function TeacherQuizContent() {
  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroomId");
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    try {
      const cid =
        searchParams.get("classroomId") ||
        localStorage.getItem("classroomId");

      if (!cid || cid === "null") {
        console.warn("Missing classroomId in URL");
        return;
      }

      const res = await api.get(`/quiz/classroom/${cid}`);

      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch quizzes");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await api.delete(`/quiz/${id}`);

      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz");
    }
  };

  useEffect(() => {
    if (classroomId && classroomId !== "null") {
      localStorage.setItem("classroomId", classroomId);
    }
    fetchQuizzes();
  }, [classroomId]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        <Link 
          href={classroomId && classroomId !== "null" 
            ? `/teacher/quiz/create?classroomId=${classroomId}` 
            : "/teacher/classrooms"}
        >
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded font-semibold">
            ➕ Create Quiz
          </button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center text-gray-500">
          No quizzes available yet...
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">{quiz.title}</h2>
                <p className="text-gray-500 text-sm">
                  Classroom: {quiz.classroomId?.name || quiz.classroomId?._id}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/teacher/quiz/view/${quiz._id}`}>
                   <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                    View
                   </button>
                 </Link>

                <Link href={`/teacher/quiz/edit/${quiz._id}`}>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeacherQuizPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading quizzes...</div>}>
      <TeacherQuizContent />
    </Suspense>
  );
}