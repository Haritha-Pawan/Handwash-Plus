import { useEffect, useState } from "react";
import { getMyStats } from "../services/postServices/postService.js";

export const useStats = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    activePosts: 0,
    totalVotes: 0,
    rank: "-"
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getMyStats();
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};