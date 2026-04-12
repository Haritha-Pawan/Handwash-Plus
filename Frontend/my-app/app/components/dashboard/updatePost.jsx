import { useState, useEffect } from "react";

export default function PostUpdate({ post, onClose, onUpdate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // ✅ sync when modal opens / post changes
  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setImage(null);
    }
  }, [post]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/posts/${post._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      // ❗ IMPORTANT: avoid HTML response crash
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server did not return JSON (check backend error)");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Update failed");
      }

      // ✅ update parent UI
      if (onUpdate) {
        onUpdate(data);
      }

      onClose();

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Update Post</h2>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      {/* TITLE */}
      <label className="text-sm text-gray-600">Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      {/* CONTENT */}
      <label className="text-sm text-gray-600">Content</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      {/* IMAGE */}
      <label className="text-sm text-gray-600">Update Image</label>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />

      {/* BUTTON */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
}