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
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        value: {
          type: Number,
          enum: [1, -1],
          required: true,
        },
      },
    ],

    voteCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);