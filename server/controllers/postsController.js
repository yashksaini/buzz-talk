import mongoose from "mongoose";
import { Friend, Posts } from "../schemas/schemas.js";

export const createPost = async (req, res) => {
  try {
    const { content, isPublic, userId } = req.body;

    // Validate required fields
    if (!content) {
      return res.status(400).json({ message: "Content is required." });
    }

    // Create a new post
    const newPost = new Posts({
      userId,
      content,
      isPublic: isPublic,
    });

    // Save the post to the database
    await newPost.save();

    res.status(200).json({
      message: "Post created successfully.",
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllPublicPosts = async (req, res) => {
  try {
    const { page = 1, loggedInUserId } = req.query;
    const limit = 5; // Number of posts per page
    const skip = (page - 1) * limit;
    const userObjectId = new mongoose.Types.ObjectId(loggedInUserId);

    const publicPosts = await Posts.aggregate([
      { $match: { isPublic: true } }, // Filter public posts
      { $sort: { createdOn: -1 } }, // Sort by newest first
      { $skip: skip }, // Skip based on pagination
      { $limit: limit }, // Limit results
      {
        $lookup: {
          from: "users", // Reference the Users collection
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" }, // Unwind the user details
      {
        $addFields: {
          likeCount: { $size: "$likes" }, // Count the number of likes
          commentCount: { $size: "$comments" }, // Count the number of comments
          isLikedByUser: {
            $in: [
              userObjectId,
              { $map: { input: "$likes", as: "like", in: "$$like.userId" } },
            ],
          },
        },
      },
      {
        $project: {
          content: 1,
          createdOn: 1,
          "user.username": 1,
          "user.miniImg": 1,
          "user.fullName": 1,
          likeCount: 1,
          commentCount: 1,
          isLikedByUser: 1,
        },
      },
    ]);

    // Get the total count of public posts
    const totalPosts = await Posts.countDocuments({ isPublic: true });

    res.status(200).json({
      message: "Public posts fetched successfully.",
      posts: publicPosts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching public posts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const toggleLike = async (req, res) => {
  const { postId, userId } = req.body; // Get post ID from URL params
  try {
    // Find the post
    const postObjectId = new mongoose.Types.ObjectId(postId);
    const post = await Posts.findById(postObjectId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user already liked the post
    const likeIndex = post.likes.findIndex(
      (like) => like.userId.toString() === userId
    );

    if (likeIndex > -1) {
      // User already liked the post, so remove the like
      post.likes.splice(likeIndex, 1);
    } else {
      // Add a new like with userId and likedOn
      post.likes.push({ userId, likedOn: new Date() });
    }

    // Save the updated post
    await post.save();

    // Send response
    res.status(200).json({
      message: likeIndex > -1 ? "Like removed" : "Like added",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getPostById = async (req, res) => {
  const { postId, userId } = req.query;

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const postObjectId = new mongoose.Types.ObjectId(postId);

    // Fetch the post
    const post = await Posts.findById(postObjectId).populate({
      path: "userId", // The field in Posts that references the Users collection
      select: "username miniImg fullName", // Specify the fields to extract
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // If the requester is the owner, send the post data directly
    if (post.userId.equals(userObjectId)) {
      return res.status(200).json({ post, message: "Post found" });
    }

    // If the post is private, check the friendship status
    if (!post.isPublic) {
      const isFriend = await Friend.exists({
        $or: [
          { sender: userObjectId, receiver: post.userId, status: "accepted" },
          { sender: post.userId, receiver: userObjectId, status: "accepted" },
        ],
      });

      if (!isFriend) {
        return res.status(200).json({ message: "Access denied", post: {} });
      }
    }

    // If public or friend, send the post data
    res.status(200).json({ post, message: "Post found" });
  } catch (error) {
    console.error("Error getting post by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
