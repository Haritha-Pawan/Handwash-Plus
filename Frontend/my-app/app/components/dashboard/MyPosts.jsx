"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Best handwash for kids",
    description: "Looking safe and gentle options for daily use.",
    image: "/images/post1.png",
    votes: 10,
    user: "Lahiru",
  },
  {
    id: 2,
    title: "Hygiene tips for public places",
    description: "What are the best hygiene practices?",
    image: "/images/post2.jpg",
    votes: 22,
    user: "Lahiru",
  },
  {
    id: 3,
    title: "Natural handwash ideas",
    description: "Any homemade solutions?",
    image: "/images/post3.jpg",
    votes: 5,
    user: "Lahiru",
  },
];

export default function MyPosts() {
  return (
    <div className="h-[calc(100vh-40px)] flex flex-col ">
      
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">My Posts</h2>

      {/* Scrollable Area */}
      <div className="overflow-y-auto pr-2 space-y-4">
        
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow hover:shadow-md transition"
          >
            {/* Image */}
            <div className="relative  h-80">
              <Image
                src={post.image}
                alt={post.title}
                fill
                
             
                className="rounded-t-xl"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex justify-between items-start">
              
              {/* Left */}
              <div>
                <h3 className="font-semibold text-lg">{post.title}</h3>

                <p className="text-gray-500 text-sm mt-1">
                  {post.description}
                </p>

                <div className="text-sm mt-2 text-gray-600">
                  👍 {post.votes} votes
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex gap-3">
                <button className="text-blue-500 hover:text-blue-700">
                  <Pencil size={18} />
                </button>

                <button className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}