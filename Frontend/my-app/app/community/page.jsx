"use client";

import { useEffect, useState } from "react";
import CommunitySection from "../components/community/communitySection";
import PostCard from "../components/community/PostCard";
import { getAllPosts } from "../services/postServices/postService";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("latest");
  const [loading, setLoading] = useState(true);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();

        // 🔥 normalize backend data
        const formatted = data.map((post) => ({
          id: post._id,
          title: post.title,
          description: post.content,
          image: post.imageUrl,
          user: post.author?.name || "Anonymous",
          votes: post.votes || 0,
          createdAt: post.createdAt,
        }));

        setPosts(formatted);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ✅ SORTING LOGIC
  const sortedPosts = [...posts].sort((a, b) => {
    if (filter === "votes") return b.votes - a.votes;
    if (filter === "latest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">

        <CommunitySection setFilter={setFilter} />

        {/* Loading state */}
        {loading ? (
          <p className="text-center mt-10">Loading posts...</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}