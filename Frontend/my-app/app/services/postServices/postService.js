
import API from "../../api/api";

// ✅ Create Post (with image upload)
export const createPost = async (formData) => {
  const res = await API.post("/posts/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ✅ Get My Posts
export const getMyPosts = async () => {
  const res = await API.get("/posts/my-posts");
  return res.data;
};
//get my stats
export const getMyStats = async () => {
  const res = await API.get("/posts/me");
  return res.data;
};

// ✅ Get All Posts
export const getAllPosts = async () => {
  const res = await API.get("/posts/");
  return res.data;
};

// ✅ Update Post
export const updatePost = async (id, data) => {
  const res = await API.put(`/posts/${id}`, data);
  return res.data;
};

// ✅ Delete Post
export const deletePost = async (id) => {
  const res = await API.delete(`/posts/${id}`);
  return res.data;
};
// ✅ Vote Post
export const votePost = async (postId, value) => {
  const res = await API.post(`/posts/${postId}/vote`, { value });
  return res.data;
};


// ✅ Get Top Posts (Ranking)
export const getTopPosts = async () => {
  const res = await API.get("/posts/top-posts");
  return res.data;
};


// ✅ Register
export const registerUser = async (data) => {
  try {
    const res = await API.post("/users/register", data);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// ✅ Login
export const loginUser = async (data) => {
  try {
    const res = await API.post("/users/login", data);
    return res.data;
  } catch (error) {
    // Return backend error message if available
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
