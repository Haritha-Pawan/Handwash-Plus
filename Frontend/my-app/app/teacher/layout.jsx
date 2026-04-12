"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TeacherSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroomId");

  const navItems = [
    { name: "Quiz", path: "/teacher/classrooms" },
    { name: "Students", path: "/teacher/students" },
    { name: "Classroom Bottles", path: `/teacher/classroom-bottles/view/${classroomId}` }
  ];

  return (
    <nav
      style={{
        width: "220px",
        background: "#1e293b",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Teacher Dashboard</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {navItems.map((item) => (
          <li key={item.path} style={{ marginBottom: "10px" }}>
            <Link
              href={
                item.name === "Quiz"
                  ? `/teacher/quiz${classroomId ? `?classroomId=${classroomId}` : ""}`
                  : item.name === "Classroom Bottles"
                  ? `/teacher/classroom-bottles/view${classroomId ? `?classroomId=${classroomId}` : ""}`
                  : item.path
              }
              style={{
                color: pathname === item.path ? "#38bdf8" : "#fff",
                textDecoration: "none",
                fontWeight:
                  pathname === item.path ? "bold" : "normal",
              }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function TeacherLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar with Suspense boundary to fix prerendering of useSearchParams */}
      <Suspense fallback={<div style={{ width: "220px", background: "#1e293b" }} />}>
        <TeacherSidebar />
      </Suspense>

      {/* Main content */}
      <main style={{ flex: 1, padding: "20px", background: "#f1f5f9" }}>
        {children}
      </main>
    </div>
  );
}