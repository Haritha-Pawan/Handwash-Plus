import Post from "../post/post.model.js";
import mongoose from "mongoose";

export const getMyStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const myStats = await Post.aggregate([
      {
        $match: { author: userId },
      },
      {
        $group: {
          _id: "$author",
          totalPosts: { $sum: 1 },
          activePosts: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
          totalVotes: { $sum: "$voteCount" },
        },
      },
    ]);

    const stats = myStats[0] || {
      totalPosts: 0,
      activePosts: 0,
      totalVotes: 0,
    };

    // 2. Ranking (all users)
    const leaderboard = await Post.aggregate([
      {
        $group: {
          _id: "$author",
          totalVotes: { $sum: "$voteCount" },
        },
      },
      { $sort: { totalVotes: -1 } },
    ]);

    // 3. Find rank
    let rank = null;
    leaderboard.forEach((user, index) => {
       if (!user._id) return; 
      if (user._id.toString() === userId.toString()) {
        rank = index + 1;
      }
    });

    res.json({
      totalPosts: stats.totalPosts || 0,
      activePosts: stats.activePosts || 0,
      totalVotes: stats.totalVotes || 0,
      rank,
    });

  } catch (err) {
    
    console.error("STATS ERROR:", err); 
    res.status(500).json({ message: "Error fetching stats" });
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Post.aggregate([
      {
        $group: {
          _id: "$author",
          totalVotes: { $sum: "$voteCount" },
          totalPosts: { $sum: 1 },
        },
      },
      { $sort: { totalVotes: -1 } },
      { $limit: 10 },
    ]);

    res.json(leaderboard);

  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};