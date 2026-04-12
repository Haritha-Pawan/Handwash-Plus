"use client";

import { useEffect, useState, Suspense } from "react";
import QuizForm from "../../../components/quiz/quizForm";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function CreateQuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [classroomId, setClassroomId] = useState(null);

  useEffect(() => {
    const urlId = searchParams.get("classroomId");
    const storedId = localStorage.getItem("classroomId");
   
    if (urlId && urlId !== "null") {
      setClassroomId(urlId);
      localStorage.setItem("classroomId", urlId); 
    } else if (storedId && storedId !== "null") {
      setClassroomId(storedId);
    } else {
      // Automatic redirect if no ID is found anywhere
      router.push("/teacher/classrooms");
    }
  }, [searchParams, router]);

  if (!classroomId || classroomId === "null") {
    return <p className="p-6">Redirecting to classroom selection...</p>;
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

export default function CreateQuizPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <CreateQuizContent />
    </Suspense>
  );
}