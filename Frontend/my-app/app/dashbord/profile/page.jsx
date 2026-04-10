import React from "react";

export default function ProfileView() {
  return (
    <div className="min-h-screen bg-gray-100 flex  justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full  p-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Profile Image Section */}
        <div className="flex flex-col items-center border-r pr-4">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-semibold">John Doe</h2>
          <p className="text-gray-500">Student</p>
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">John Doe</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">john@example.com</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium">Male</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">School</p>
            <p className="font-medium">ABC College</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Grade</p>
            <p className="font-medium">Grade 12</p>
          </div>

        </div>
      </div>
    </div>
  );
}
