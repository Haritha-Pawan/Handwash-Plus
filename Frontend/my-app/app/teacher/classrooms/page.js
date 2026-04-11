"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function TeacherClassrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/classrooms/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClassrooms(res.data.classrooms);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Classrooms</h1>

      {classrooms.map((c) => (
        <div
          key={c._id}
          className="p-4 border mb-2 flex justify-between"
        >
          <div>
            <h2 className="font-bold">{c.name}</h2>
            <p className="text-sm text-gray-500">
              Grade {c.grade}
            </p>
          </div>

          <button
            className="bg-blue-500 text-white px-3 py-1"
           // onClick={() => router.push(`/teacher/quiz/${c._id}`)}
            //onClick={() => router.push(`/teacher/quiz`)}
            onClick={()=> {
              localStorage.setItem("classroomId", c._id);
              router.push(`/teacher/quiz?classroomId=${c._id}`);}}
          >
            View Quizzes
          </button>
        </div>
      ))}
    </div>
  );
}