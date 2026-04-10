"use client";

import React, { useEffect, useState } from "react";

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  const classroomId = "699c1b8f7d82290b85e8bdd9"; // your manual classroomId

  useEffect(() => {
    fetch("http://localhost:5000/api/students/active", {
      method: "POST",  
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classroomId }) // send classroomId in POST body
    })
      .then(res => res.json())
      .then(data => {
        if (data.studentQuiz) {
          setQuiz(data.studentQuiz);
          setAnswers(new Array(data.studentQuiz.questions.length).fill(null)); // prefill answers
        } else {
          alert(data.message || "No active quiz available");
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        alert("Failed to load quiz");
      });
  }, []);

  const handleAnswer = (qIndex, value) => {
    const updated = [...answers];
    updated[qIndex] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    alert("Answers submitted! Check console.");
  };

  if (!quiz) return <h2>Loading quiz...</h2>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>{quiz.title}</h1>
      <p>Start: {new Date(quiz.startTime).toLocaleString()}</p>
      <p>End: {new Date(quiz.endTime).toLocaleString()}</p>

      {quiz.questions.map((q, i) => (
        <div key={q._id} style={{ marginBottom: "20px" }}>
          <h3>{i + 1}. {q.questionText}</h3>

          {q.type === "mcq" || q.type === "truefalse" ? (
            q.options.map((opt, j) => (
              <div key={j}>
                <label>
                  <input
                    type="radio"
                    name={`question-${i}`}
                    value={opt.text}
                    checked={answers[i] === opt.text}
                    onChange={() => handleAnswer(i, opt.text)}
                  />
                  {opt.text}
                </label>
              </div>
            ))
          ) : q.type === "rating" ? (
            <input
              type="number"
              min={1}
              max={5}
              placeholder="Rate 1-5"
              value={answers[i] || ""}
              onChange={e => handleAnswer(i, e.target.value)}
            />
          ) : null}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        style={{ padding: "10px 20px", background: "#06b6d4", color: "#fff", borderRadius: "5px" }}
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizPage;