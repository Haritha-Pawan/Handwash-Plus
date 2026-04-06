import Image from "next/image";
import VoteButton from "./VoteButton";

export default function PostCard({ post }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
      
      {/* Image */}
      <div className="relative w-full h-40">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-[180px]">
        
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">
            {post.title}
          </h3>

          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {post.description}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-4">
          
          {/* Owner */}
          <span className="text-sm text-gray-600">
            created by {post.user}
          </span>

          {/* Vote */}
          <VoteButton initialVotes={post.votes} />
        </div>
      </div>
    </div>
  );
}