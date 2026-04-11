"use client";

import { useState } from "react";
import { createQuiz } from "../../constance/quizApi.js";

export default function QuizForm({ classroomId, refresh }) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: [{ text: "" }], correctAnswer: "" },
  ]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Update question text
  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  // Update option text
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
  };

  // Add new question
  const addQuestion = () => {
    setQuestions([...questions, { questionText: "",type: "multiple-choice", options: [{ text: "" }], correctAnswer: "" }]);
  };

  // Remove a question
  const removeQuestion = (qIndex) => {
    const updated = [...questions];
    if (updated.length > 1) {
      updated.splice(qIndex, 1);
      setQuestions(updated);
    }
  };

  // Add option to question
  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "" });
    setQuestions(updated);
  };

  // Remove option from question
  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length > 1) {
      updated[qIndex].options.splice(oIndex, 1);
      setQuestions(updated);
    }
  };

  // Submit quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classroomId) {
        alert("Missing classroomId");
        return;
      }

    try {
      await createQuiz({
        title,
        classroomId,
        questions,
        startTime,
        endTime,
        isActive,
      });
      alert("✅ Quiz Created Successfully!");
      setTitle("");
      setQuestions([{ questionText: "", options: [{ text: "" }], correctAnswer: "" }]);
      setStartTime("");
      setEndTime("");
      setIsActive(true);
      refresh && refresh();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create quiz");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Quiz 📝</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        {/* Questions */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-4 rounded space-y-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Question {qIndex + 1}</h3>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-500 font-bold"
              >
                ❌ Remove
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter question text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            {/* Options */}
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  required
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => removeOption(qIndex, oIndex)}
                  className="text-red-500 font-bold"
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(qIndex)}
              className="text-cyan-600 font-semibold mt-2"
            >
              ➕ Add Option
            </button>

            {/* Correct Answer */}
            <input
              type="text"
              placeholder="Correct Answer"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 mt-2"
            />
          </div>
        ))}

        {/* Add Question Button */}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded font-semibold"
        >
          ➕ Add Question
        </button>

        {/* Start / End Time */}
        <div className="flex gap-4 mt-4">
          <div>
            <label className="block font-medium mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
        </div>

        {/* Active / Disable */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-5 w-5"
          />
          <span className="font-medium">Quiz Active </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold mt-4"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
}