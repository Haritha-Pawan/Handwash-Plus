"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function EditQuizPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  //  Load quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz/${id}`);
        const quiz = res.data;

        setTitle(quiz.title || "");
        setQuestions(
          quiz.questions.map(q => ({
            questionText: q.questionText || "",
            options: q.options.map(o => ({ text: o.text || "" })),
            correctAnswer: q.correctAnswer || "",
            type: q.type || "multiple-choice"
          }))
        );
        setStartTime(quiz.startTime ? quiz.startTime.slice(0, 16) : ""); // convert ISO to datetime-local
        setEndTime(quiz.endTime ? quiz.endTime.slice(0, 16) : "");
        setIsActive(quiz.isPublished || false);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load quiz");
      }
    };

    if (id) fetchQuiz();
  }, [id]);

  // 🔹 Handle question text change
  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  // 🔹 Handle option change
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
  };

  // Add / Remove question
  const addQuestion = () => setQuestions([...questions, { questionText: "", options: [{ text: "" }], correctAnswer: "", type: "multiple-choice" }]);
  const removeQuestion = qIndex => setQuestions(questions.filter((_, i) => i !== qIndex));

  //  Add / Remove option
  const addOption = qIndex => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "" });
    setQuestions(updated);
  };
  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length > 1) updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  // Update quiz
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/quiz/${id}`, {
        title,
        questions,
        startTime,
        endTime,
        isPublished: isActive,
      });
      alert("✅ Quiz updated successfully!");
      router.push("/teacher/quiz");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Quiz 📝</h2>

      {/* Title */}
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />

      {/* Questions */}
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border p-4 rounded mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Question {qIndex + 1}</h3>
            <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 font-bold">❌ Remove</button>
          </div>

          <input
            type="text"
            placeholder="Question text"
            value={q.questionText}
            onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Options */}
          {q.options.map((opt, oIndex) => (
            <div key={oIndex} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder={`Option ${oIndex + 1}`}
                value={opt.text}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="text-red-500 font-bold">❌</button>
            </div>
          ))}
          <button type="button" onClick={() => addOption(qIndex)} className="text-cyan-600 font-semibold mb-2">➕ Add Option</button>

          {/* Correct Answer */}
          <input
            type="text"
            placeholder="Correct Answer"
            value={q.correctAnswer}
            onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      ))}

      <button type="button" onClick={addQuestion} className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded font-semibold mb-4">➕ Add Question</button>

      {/* Start / End Time */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Start Time</label>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        </div>
        <div>
          <label className="block mb-1 font-medium">End Time</label>
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        </div>
      </div>

      {/* Active / Disable */}
      <div className="flex items-center gap-2 mb-4">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-5 w-5" />
        <span className="font-medium">Quiz Active</span>
      </div>

      {/* Update button */}
      <button type="button" onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold">Update Quiz</button>
    </div>
  );
}