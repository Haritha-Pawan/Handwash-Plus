"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TeacherLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const classroomId = searchParams.get("classroomId");

  const navItems = [
    { name: "Quiz", path: "/teacher/quiz" },
    { name: "Students", path: "/teacher/students" },
    { name: "Classroom Bottles", path: "/teacher/classroom-bottles/view" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
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
                   ? classroomId
                    ? `/teacher/quiz?classroomId=${classroomId || ""}`
                    : "/teacher/classroom"
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

          {/* Logout */}
          <li style={{ marginTop: "15px" }}>
            <button
              onClick={handleLogout}
              style={{
                background: "#1e293b",
                color: "#fff",
                border: "none",
                padding: "8px",
                borderRadius: "6px",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
              }}
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, padding: "20px", background: "#f1f5f9" }}>
        {children}
      </main>
    </div>
  );
}