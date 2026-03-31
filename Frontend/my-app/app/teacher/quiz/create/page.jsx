"use client";

import QuizForm from "@/app/components/quiz/quizForm";
import Link from "next/link";

export default function CreateQuizPage() {
  const classroomId = "69a16726dd121c3b5542c1f1";

  return (
    <div className="p-6">
      {/* Back Button */}
      <Link href="/teacher/quiz">
        <button className="mb-4 text-cyan-600 font-semibold">
          ← Back to Quizzes
        </button>
      </Link>

      {/* Quiz Form */}
      <QuizForm classroomId={classroomId} refresh={() => {}} />
    </div>
  );
}