import Post from "./post.model.js";
import imagekit from "../../config/imagekitConfig.js";


export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user?.id;
    if (!author) {
      return res.status(401).json({ message: "User not authenticated or ID missing" });
    }

    let imageUrl = null;

    // If image file exists (from multer)
    if (req.file) {
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,   // 👈 VERY IMPORTANT
        fileName: `handwash_${Date.now()}.jpg`,
      });

      imageUrl = uploadResult.url;
    }

    const post = await Post.create({
      title,
      content,
      author,
      imageUrl,
      
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: error.message });
  }
};




/**
 * @desc Get all posts of logged-in user
 * @route GET /api/posts/my-posts
 */
export const getMyPosts = async (req, res) => {
  try {
    console.log("Logged user:", req.user.id);

    const posts = await Post.find({ author: req.user.id })
      .populate("author", "name email school class")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name email school class")
    .sort({ createdAt: -1 });

  res.json(posts);
};

export const updatePost = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { title, content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;

    // Handle image upload
    if (req.file) {
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: `handwash_${Date.now()}.jpg`,
      });
      post.imageUrl = uploadResult.url;
    }

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await post.deleteOne();
  res.json({ message: "Post deleted successfully" });
};

export const votePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { value } = req.body; // +1 or -1
    const postId = req.params.id;

    const post = await Post.findById(postId);

    // Check if user already voted
    const existingVote = post.votes.find(v => v.user.toString() === userId);

    if (existingVote) {
      // Remove old vote
      post.voteCount -= existingVote.value;

      // Update vote
      existingVote.value = value;
    } else {
      // Add new vote
      post.votes.push({ user: userId, value });
    }

    // Add new vote value
    post.voteCount += value;

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getTopPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name email school class")
    .sort({ voteCount: -1 }) // highest votes first
    .limit(10);

  res.json(posts);
};
