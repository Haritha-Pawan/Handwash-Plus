"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ViewQuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quiz/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuiz();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!quiz) return <div className="p-6 text-red-500">Quiz not found</div>;

  return (
    <div className="p-6">
      {/* Top bar with Back button on the left */}
      <div className="flex items-center mb-4">
       
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
      </div>

      {/* Classroom info */}
      <p className="text-gray-500 mb-4">
        Classroom: {quiz.classroomId?.name}
      </p>

      {/* Questions */}
      {quiz.questions.map((q, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded shadow mb-4"
        >
          <h2 className="font-semibold">
            {index + 1}. {q.questionText}
          </h2>

          <ul className="mt-2 list-disc list-inside">
            {q.options.map((opt, i) => (
              <li key={i}>{opt.text}</li>
            ))}
          </ul>

          <p className="text-green-600 mt-2">
            Correct: {q.correctAnswer}
          </p>
        </div>
      ))}
       <Link
         href={`/teacher/quiz?classroomId=${quiz.classroomId?._id}`}
          className="bg-gray-200 hover:bg-gray-335 text-black px-3 py-1 rounded text-sm mr-4"
        >
           Back to Quiz List
        </Link>
    </div>
  );
}