"use client";

import { useEffect, useState } from "react";
import QuizForm from "../../../components/quiz/quizForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CreateQuizPage() {
  const searchParams = useSearchParams();
  const [classroomId, setClassroomId] = useState(null);

   useEffect(() => {
    const urlId = searchParams.get("classroomId");
   // const localId = localStorage.getItem("classroomId");

    //setClassroomId(urlId || localId);
    if (urlId) {
    setClassroomId(urlId);
    localStorage.setItem("classroomId", urlId); // IMPORTANT FIX
  }
  }, [searchParams]);

  if (!classroomId) {
    return <p className="p-6">Loading classroom...</p>;
  }

  return (
    <div className="p-6">
      <Link href={`/teacher/quiz?classroomId=${classroomId}`}>
        <button className="mb-4 text-cyan-600 font-semibold">
          ← Back to Quizzes
        </button>
      </Link>

      <QuizForm classroomId={classroomId} refresh={() => {}} />
    </div>
  );
}