
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
        <DashboardHeader />
    
      <Sidebar />
      <main className="flex-1  bg-gray-100 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}