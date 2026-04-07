"use client";

import Sidebar from "../components/dashboard/Sidebar";
import MyPosts from "../components/dashboard/MyPosts";
import RightSidebar from "../components/dashboard/RightSidebar";
import DashbordHeader from "../components/dashboard/dashbordHeader";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex ">
        {/* Header */}
      <DashbordHeader />
      
      {/* LEFT */}
      <Sidebar />

      {/* MIDDLE */}
      <div className="flex-1 p-6 max-w-[700px] bg-gray-50 ">
        <MyPosts />
      </div>

      {/* RIGHT */}
      <div >
      <RightSidebar />
      </div>
    </div>
  );
}