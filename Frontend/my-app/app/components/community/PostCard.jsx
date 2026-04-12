import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [votes, setVotes] = useState(post.votes);

  const handleClick = () => {
    setLiked(!liked);
    setVotes(liked ? votes - 1 : votes + 1);
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden mb-20">
      {/* Image */}
      <div className="relative w-full h-60">
        {post.image && post.image.trim() !== "" ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-[180px]">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{post.title}</h3>

          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {post.description}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-4">
          {/* LEFT: Profile + Name */}
          <div className="flex items-center gap-2">
            {/* Profile Icon */}
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
              {post.user.charAt(0)}
            </div>

            {/* Name */}
            <span className="text-sm font-bold text-gray-700">{post.user}</span>
          </div>

          {/* RIGHT: Vote */}
          <button
            onClick={handleClick}
            className={`flex items-center gap-1 ${liked ? "text-red-500" : "text-gray-600"
              }`}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            <span className="text-sm">{votes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
