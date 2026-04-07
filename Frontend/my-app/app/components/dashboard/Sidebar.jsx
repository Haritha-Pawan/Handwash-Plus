import { Home, User, PlusSquare, Users,Bell } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-72 bg-white p-5 shadow-md">
      
      <h2 className="text-xl font-bold mb-6">Community</h2>

      <div className="flex flex-col gap-4">

        <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
          <Home size={18} /> Home
        </button>

         <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
          <User size={18} /> My Profile
        </button>
        
        <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
          <PlusSquare size={18} /> Create Post
        </button>

        <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
          <Users size={18} /> Community
        </button>

       
          <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
          <Bell size={18} /> Notifications
        </button>


      </div>
    </div>
  );
}