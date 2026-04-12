"use client";

import { useState } from "react";
import CommunitySection from "../components/community/communitySection";
import PostCard from "../components/community/PostCard";
import { dummyPosts } from "../constance/data/costance";



export default function CommunityPage() {
  const [posts, setPosts] = useState(dummyPosts);
  const [filter, setFilter] = useState("latest");

  const sortedPosts = [...posts].sort((a, b) => {
    if (filter === "votes") return b.votes - a.votes;
    return b.id - a.id;
  });

  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-4  ">
      <CommunitySection setFilter={setFilter} />

    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {sortedPosts.map((post) => (
    <PostCard key={post.id} post={post} />
  ))}
</div>
      </div>
    </div>
  );
}