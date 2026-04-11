import { Search, Bell, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0  right-0 h-16 bg-white border-b border-gray-200 z-50 ">
      <div className="h-full px-4 flex items-center justify-between max-w-screen-2xl">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-2xl font-bold text-blue-600">
            CleanHands
          </div>
        </div>


        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <User className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
}
