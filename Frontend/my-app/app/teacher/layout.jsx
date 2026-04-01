"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TeacherLayout({ children }) {
  const pathname = usePathname();

  // Example teacher name; replace with dynamic data later
  const teacher = {
    name: "John Doe",
  };

  const navItems = [
    { name: "Quiz", path: "/teacher/quiz" },
    { name: "Students", path: "/teacher/students" },
    { name: "Distributed Bottles", path: "/teacher/classroom-bottles/view" },
  ];

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
                href={item.path}
                style={{
                  color: pathname === item.path ? "#38bdf8" : "#fff",
                  textDecoration: "none",
                  fontWeight: pathname === item.path ? "bold" : "normal",
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, padding: "20px", background: "#f1f5f9" }}>
        {/* Top-right greeting */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontSize: "22px", fontWeight: "600" }}>
            👋 Hello, <span style={{ fontWeight: "bold" }}>{teacher.name}</span>
          </p>
        </div>

        {/* Page content */}
        {children}
      </main>
    </div>
  );
}