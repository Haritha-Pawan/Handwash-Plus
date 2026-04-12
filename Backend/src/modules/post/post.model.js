import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: Number, // +1 (upvote) or -1 (downvote)
      },
    ],

    voteCount: {
      type: Number,
      default: 0,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Post", postSchema);
