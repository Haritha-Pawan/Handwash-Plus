"use client";

import Image from "next/image";
import { useState } from "react";
import { Upload, ImagePlus, Send } from "lucide-react";
import { createPost } from "../../services/postServices/postService";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please fill all fields ❌");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", description); 
      if (image) formData.append("image", image);

      await createPost(formData);

      alert("Post created successfully ✅");

      // reset
      setTitle("");
      setDescription("");
      setImage(null);
      setPreview("");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to create post ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center max-w-3xl  p-6">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-[500px]  p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Post ✨</h1>
          <p className="text-gray-500 text-sm">Share your idea with others</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Image Upload */}
          <div>
            <label className="text-sm text-gray-600">Upload Image</label>
            <div className="mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="fileUpload" />
              <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center gap-2">
                {preview ? (
                  <div className="relative w-full h-48">
                    <Image src={preview} alt="preview" fill className="object-cover rounded-lg" />
                  </div>
                ) : (
                  <>
                    <ImagePlus className="text-gray-400" size={30} />
                    <p className="text-gray-500 text-sm">Click to upload image</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm text-gray-600">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your post..."
              rows={4}
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Send size={18} />
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
