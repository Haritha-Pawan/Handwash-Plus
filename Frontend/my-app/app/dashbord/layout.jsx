
import Sidebar from "../components/dashboard/Sidebar";
import DashbordHeader from "../components/dashboard/dashbordHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
        <DashbordHeader />
    
      <Sidebar />
      <main className="flex-1  bg-gray-100 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}