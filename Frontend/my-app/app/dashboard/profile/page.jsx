// app/profile/page.js  (or pages/profile.js)

import { Camera, Pencil } from "lucide-react";
import Image from "next/image";

const personalRows = [
  [
    { label: "First Name", value: "Natashia" },
    { label: "Last Name", value: "Khaleira" },
    { label: "Class Name", value: "grade 6A" },
  ],
  [
    { label: "Email Address", value: "info@binary-fusion.com" },
    { label: "School", value: "kannaganra central collage" },
    { label: "User Role", value: "student" },
  ],
];

const bio= [
  { label: "Country", value: "United Kingdom" },
  { label: "City", value: "Leeds, East London" },
  { label: "Postal Code", value: "ERT 1254" },
];

function InfoGrid({ rows }) {
  return (
    <div className="">
      {rows.map((row, i) => (
        <div key={i}>
          {i > 0 && <hr className="border-gray-100 mb-5" />}
          <div className="grid grid-cols-3 gap-x-4 gap-y-5">
            {row.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                  {label}
                </p>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className=" max-w-5xl space-y-4">
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-7 flex items-center gap-5">
          <div className="relative w-[76px] h-[76px] shrink-0">
            <Image
              src="/avatar.jpg"
              alt="Profile"
              fill
              className="rounded-full object-cover border-2 border-green-100"
            />
            <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Natashia Khaleira</h2>
            <p className="text-sm text-gray-500">Admin</p>
            <p className="text-sm text-gray-500">Leeds, United Kingdom</p>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-sm p-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-blue-500">Personal Information</h3>
            <button className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Edit <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <InfoGrid rows={personalRows} />
        </div>

     {/* About Me Card */}
<div className="bg-white rounded-2xl shadow-sm p-7">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-base font-bold text-blue-500">About Me</h3>
    <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
      Edit <Pencil className="w-3.5 h-3.5" />
    </button>
  </div>

  <textarea
    className="w-full text-sm text-gray-700 leading-relaxed resize-non"
    rows={5}
    placeholder="Write something about yourself..."
    defaultValue="Hi! I'm John, a 3rd year Computer Science student at the University of Leeds. I love building web applications and exploring new technologies in my free time."
  />
</div>

      </div>
    </div>
  );
}