import { useEffect, useState } from "react";
import { getMyPosts } from "../services/postServices/postService.js";
import { getAuthToken } from "../lib/auth";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = getAuthToken();
      if (!token) {
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getMyPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, setPosts, loading };
};