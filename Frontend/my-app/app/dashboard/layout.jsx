import { Suspense } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Suspense fallback={<div className="w-72 bg-white" />}>
        <DashboardHeader />
        <Sidebar />
      </Suspense>
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}