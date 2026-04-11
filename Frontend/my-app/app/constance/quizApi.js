const BASE_URL = "http://localhost:5000/api/quiz";

export const createQuiz = async (data) => {
  const token = localStorage.getItem("token");

if (!data.classroomId) {
    throw new Error("classroomId is missing");
  }

  const payload = {
    title: data.title,
    classroomId: data.classroomId,
    questions: data.questions || [],
    startTime: data.startTime || null,
    endTime: data.endTime || null,
    isPublished: data.isActive ?? false,
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Server response:", text);
    throw new Error("Failed to create quiz");
  }

  return res.json();
};