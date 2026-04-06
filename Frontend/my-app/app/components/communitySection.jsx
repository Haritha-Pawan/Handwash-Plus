"use client";

import { useState } from "react";

export default function CommunityTopSection({ setFilter }) {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full">
      
      {/* 🔝 HEADER (Image + Overlay Text) */}
      <div className="relative w-full h-[250px] rounded-b-3xl overflow-hidden">
        <img
          src="/images/banner1.jpg"
          alt="community"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="max-w-6xl mx-auto px-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">
              Join the HandWash Community
            </h1>
            <p className="mt-2 text-sm md:text-base">
              Share ideas, ask questions, and improve hygiene awareness.
            </p>
          </div>
        </div>
      </div>

      {/* 🔽 CONTROLS SECTION */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* Row 1: Stats + Button */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          
          {/* Stats */}
          <div className="flex gap-6 text-gray-700 text-sm">
            <span>👥 12,000 Members</span>
            <span>📝 4,500 Posts</span>
          </div>

          {/* My Post Button */}
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
            + My Post
          </button>
        </div>

        {/* Row 2: Search + Filter */}
        <div className="flex gap-3 mt-4 flex-wrap">
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4  py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Filter Dropdown */}
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="px-6   py-2 border rounded-lg focus:outline-none"
          >
            <option value="latest">Latest</option>
            <option value="votes">Highest Votes</option>
            <option value="gradeA">Grade A</option>
            <option value="gradeB">Grade B</option>
          </select>
        </div>
      </div>
    </div>
  );
}