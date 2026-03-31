"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function TeacherQuizPage() {
  const classroomId = "699c1b8f7d82290b85e8bdd9"; // your classroom ID
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quiz/classroom/${classroomId}`);
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch quizzes");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/quiz/${id}`);
      setQuizzes(quizzes.filter((q) => q._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz");
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        <Link href="/teacher/quiz/create">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded font-semibold">
            ➕ Create Quize
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