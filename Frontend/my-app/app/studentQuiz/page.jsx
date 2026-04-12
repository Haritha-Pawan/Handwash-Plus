"use client";

import React, { useEffect, useState } from "react";

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const classroomId = "699c1b8f7d82290b85e8bdd9";

  // Load quiz OR show submitted state
  useEffect(() => {
    const alreadySubmitted = localStorage.getItem("quizSubmitted");

    if (alreadySubmitted === "true") {
      setSubmitted(true);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/students/active`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ classroomId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.studentQuiz) {
          setQuiz(data.studentQuiz);
          setAnswers(new Array(data.studentQuiz.questions.length).fill(null));
        } else {
          alert(data.message || "No active quiz available");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load quiz");
      });
  }, []);

  // Handle answer selection
  const handleAnswer = (qIndex, value) => {
    const updated = [...answers];
    updated[qIndex] = value;
    setAnswers(updated);
  };

  // Submit quiz
  const handleSubmit = () => {
    if (answers.includes(null)) {
      alert("Please answer all questions!");
      return;
    }

    console.log("Submitted Answers:", answers);

    // Save submission state
    localStorage.setItem("quizSubmitted", "true");

    setSubmitted(true);
  };

  // Loading
  if (!quiz && !submitted) {
    return <h2 className="text-center mt-10">Loading quiz...</h2>;
  }

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl">

        {/*  AFTER SUBMIT */}
        {submitted ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              🎉 Great Job!
            </h2>

            <p className="text-lg text-gray-700">
              You’ve completed the handwashing quiz! 🧼
            </p>

            <p className="mt-4 text-gray-600">
              Remember:
              <br />
              ✔ Wash your hands before meals  
              <br />
              ✔ Wash after using the toilet  
              <br />
              ✔ Use soap for at least 20 seconds  
            </p>

            <p className="mt-4 font-semibold text-cyan-600">
              Healthy habits start with YOU 💙
            </p>

            <button
              onClick={() => {
                localStorage.removeItem("quizSubmitted");
                window.location.reload();
              }}
              className="mt-6 bg-gray-200 px-4 py-2 rounded-lg"
            >
              Retake Quiz (Demo Only)
            </button>
          </div>
        ) : (
          <>
            {/* QUIZ UI */}
            <h1 className="text-3xl font-bold text-center text-cyan-600 mb-2">
              {quiz.title}
            </h1>

            <p className="text-center text-gray-500 mb-6">
              Stay clean, stay healthy ✨
            </p>

            {quiz.questions.map((q, i) => (
              <div key={q._id} className="mb-6">
                <h3 className="font-semibold mb-2">
                  {i + 1}. {q.questionText}
                </h3>

                {(q.type === "mcq" || q.type === "truefalse") &&
                  q.options.map((opt, j) => (
                    <label
                      key={j}
                      className={`block p-2 rounded-lg cursor-pointer mb-1 border ${
                        answers[i] === opt.text
                          ? "bg-cyan-100 border-cyan-400"
                          : "bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${i}`}
                        value={opt.text}
                        checked={answers[i] === opt.text}
                        onChange={() => handleAnswer(i, opt.text)}
                        className="mr-2"
                      />
                      {opt.text}
                    </label>
                  ))}

                {q.type === "rating" && (
                  <input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="Rate 1-5"
                    value={answers[i] || ""}
                    onChange={e => handleAnswer(i, e.target.value)}
                    className="border p-2 rounded w-24"
                  />
                )}
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md"
            >
              Submit Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPage;