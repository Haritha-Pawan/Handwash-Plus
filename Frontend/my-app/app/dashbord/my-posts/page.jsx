"use client";

import Image from "next/image";
import {
  FileText,
  CheckCircle,
  ThumbsUp,
  Trophy,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getMyPosts, deletePost, updatePost } from "../../services/postServices/postService";
import { useRouter } from "next/navigation";
import PostUpdate from "../../components/dashboard/updatePost";

export default function PostDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );



  // Fetch Posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getMyPosts();
        setPosts(data);
      } catch (err) {
        console.log(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Delete Post
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // Update Votes
  const handleUpdateVotes = async (id, newVotes) => {
    try {
      await updatePost(id, { votes: newVotes });
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, votes: newVotes } : p)),
      );
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  return (
    <div className="min-h-screen  bg-gray-100 p-6">
      {/* Header */}
      <div className="  bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-6 shadow-lg">
        <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
        <p className="mt-2 text-blue-100">
          Here’s an overview of your posts and activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <FileText className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Posts</p>
            <h2 className="text-xl font-bold">{posts.length}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <CheckCircle className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Posts</p>
            <h2 className="text-xl font-bold">{posts.length}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <div className="bg-pink-100 p-3 rounded-xl">
            <ThumbsUp className="text-pink-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Votes</p>
            <h2 className="text-xl font-bold">
              {posts.reduce((acc, p) => acc + (p.votes || 0), 0)}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-xl">
            <Trophy className="text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Rank</p>
            <h2 className="text-xl font-bold">#5</h2>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <div>No posts found.</div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="relative h-40">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{post.content}</p>

                <div className="text-sm mt-2 text-gray-600 flex items-center gap-2">
                  👍 {post.votes} votes
                  <button
                    onClick={() => handleUpdateVotes(post._id, post.votes + 1)}
                    className="text-blue-500 text-xs"
                  >
                    +1
                  </button>
                </div>

                <div className="flex  gap-3 mt-4">
                  <button
                    className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200"
                    onClick={() => {
                      setSelectedPost(post);
                      setIsOpen(true);
                    }}
                  >
                    <Pencil size={18} className="text-blue-600" />
                  </button>

                  <button
                    className="p-2 bg-red-100 rounded-lg hover:bg-red-200"
                    onClick={() => handleDelete(post._id)}
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {isOpen && selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[500px] relative">
            {/* Close button */}
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedPost(null);
              }}
              className="absolute top-3 right-4 text-gray-600 hover:text-black"
            >
              ✖
            </button>

            {/* YOUR EXISTING COMPONENT */}
            <PostUpdate
              post={selectedPost}
              onClose={() => {
                setIsOpen(false);
                setSelectedPost(null);
              }}
              onUpdate={handlePostUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
