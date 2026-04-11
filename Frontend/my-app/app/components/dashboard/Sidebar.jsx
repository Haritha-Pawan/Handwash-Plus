"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, PlusSquare, Users, Bell } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

 const menu = [
  { name: "Home", icon: Home, href: "/" },
  { name: "My Profile", icon: User, href: "/dashbord/profile" },
  { name: "Create Post", icon: PlusSquare, href: "/dashbord/create-post" },
  { name: "My Posts", icon: Users, href: "/dashbord/my-posts" },
  { name: "Notifications", icon: Bell, href: "/dashbord/notifications" }, // ✅ fixed
];

  return (
    <div className="w-72 bg-white p-5 shadow-md h-screen">
      <h2 className="text-xl font-bold mb-6 px-3"> Dashboard</h2>

      <div className="flex flex-col gap-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}