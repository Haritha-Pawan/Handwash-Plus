"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyPosts, deletePost, updatePost } from "../../services/postServices/postService";
import { useRouter } from "next/navigation";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔄 Fetch Posts
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

  // 🗑 Delete Post
  const handleDelete = async (id) => {
    console.log("Deleting ID:", id);

    if (!id) {
      alert("Invalid ID ❌");
      return;
    }

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(id);

      // ✅ remove from UI
      setPosts((prev) => prev.filter((p) => p._id !== id));

      alert("Post deleted successfully ✅");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to delete post.");
    }
  };

  // 👍 Update Votes
  const handleUpdateVotes = async (id, newVotes) => {
    try {
      await updatePost(id, { votes: newVotes });

      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, votes: newVotes } : p))
      );
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to update votes.");
    }
  };

  // ✏️ Edit
  const handleEdit = (id) => {
    router.push(`/edit-post/${id}`);
  };

  return (
    <div className="h-[calc(100vh-40px)] flex flex-col px-4">
      <h2 className="text-2xl font-semibold mb-4">My Posts</h2>

      <div className="overflow-y-auto pr-2 space-y-4">
        {loading ? (
          <div>Loading...</div>
        ) : posts.length === 0 ? (
          <div>No posts found.</div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id} // ✅ FIXED
              className="bg-white rounded-xl shadow hover:shadow-md transition"
            >
              {/* Image */}
              <div className="relative h-60 sm:h-72 md:h-80">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="rounded-t-xl object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {post.description}
                  </p>

                  <div className="text-sm mt-2 text-gray-600 flex items-center gap-2">
                    👍 {post.votes} votes
                    <button
                      onClick={() =>
                        handleUpdateVotes(post._id, post.votes + 1)
                      }
                      className="text-blue-500 text-xs"
                    >
                      +1
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEdit(post._id)} // ✅ FIXED
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(post._id)} // ✅ FIXED
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}