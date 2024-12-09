import mongoose from "mongoose";
import { Friend, Posts, User } from "../schemas/schemas.js";
import { addNotification } from "./notificationsController.js";
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
    const post = await Posts.findById(postObjectId)
      .populate({
        path: "userId", // The field in Posts that references the Users collection
        select: "username miniImg fullName", // Specify the fields to extract
      })
      .populate({
        path: "likes.userId", // Populate the userId in likes
        select: "username miniImg fullName", // Select user data for likes
      })
      .populate({
        path: "comments.userId", // Populate the userId in comments
        select: "username miniImg fullName", // Select user data for comments
      });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Order likes and comments in descending order
    if (post.likes) {
      post.likes = post.likes.sort(
        (a, b) => new Date(b.likedOn) - new Date(a.likedOn)
      );
    }

    if (post.comments) {
      post.comments = post.comments.sort(
        (a, b) => new Date(b.commentedOn) - new Date(a.commentedOn)
      );
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
        return res.status(200).json({ message: "Access denied", post: null });
      }
    }

    // If public or friend, send the post data
    res.status(200).json({ post, message: "Post found" });
  } catch (error) {
    console.error("Error getting post by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const addComment = async (req, res) => {
  const { postId, userId, content } = req.body; // Get post ID from URL params
  try {
    // Find the post
    const postObjectId = new mongoose.Types.ObjectId(postId);
    const post = await Posts.findById(postObjectId);
    const ownerObjectId = new mongoose.Types.ObjectId(userId);
    const owner = await User.findOne(
      { _id: ownerObjectId },
      { fullName: 1 } // Projection to include only the 'fullName' field
    ).lean();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({
      comment: content,
      commentedOn: new Date(),
      userId,
    });

    // Save the updated post
    await post.save();
    await addNotification({
      userId: post.userId,
      senderName: owner.fullName,
      title: ` commented on your post.`,
      desc: content,
      url: `/post/${postId}`,
      type: "COMMENT",
    });
    // Send response
    res.status(200).json({
      message: "comment added successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const getAllFriendsPosts = async (req, res) => {
  try {
    const { page = 1, loggedInUserId } = req.query;
    const limit = 5; // Number of posts per page
    const skip = (page - 1) * limit;
    const userObjectId = new mongoose.Types.ObjectId(loggedInUserId);

    // Get the friend list (users with whom the logged-in user is friends)
    const friends = await Friend.aggregate([
      {
        $match: {
          $or: [
            { sender: userObjectId, status: "accepted" },
            { receiver: userObjectId, status: "accepted" },
          ],
        },
      },
      {
        $project: {
          friendId: {
            $cond: [{ $eq: ["$sender", userObjectId] }, "$receiver", "$sender"],
          },
        },
      },
    ]).then((results) => results.map((doc) => doc.friendId));

    // Fetch posts from friends, both public and private
    const friendsPosts = await Posts.aggregate([
      { $match: { userId: { $in: friends } } }, // Filter posts by friends
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

    // Get the total count of posts from friends
    const totalPosts = await Posts.countDocuments({ userId: { $in: friends } });

    res.status(200).json({
      message: "Friend posts fetched successfully.",
      posts: friendsPosts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching friend posts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
export const deletePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "postId and userId are required." });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const postObjectId = new mongoose.Types.ObjectId(postId);

    // Find the post to ensure it exists and belongs to the user
    const post = await Posts.findOne({
      _id: postObjectId,
      userId: userObjectId,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized." });
    }

    // Delete the post
    await Posts.deleteOne({ _id: postId });

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
export const getAllPostsOfUser = async (req, res) => {
  try {
    const { page = 1, loggedInUserId, username } = req.query;
    const limit = 5; // Number of posts per page
    const skip = (page - 1) * limit;

    const profileUser = await User.findOne({ username }).lean();
    if (!profileUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const profileUserId = profileUser._id;
    const loggedInUserObjectId = new mongoose.Types.ObjectId(loggedInUserId);

    let filterCondition = { userId: profileUserId };

    if (!loggedInUserObjectId.equals(profileUserId)) {
      // Check if logged-in user is a friend
      const isFriend = await Friend.exists({
        $or: [
          {
            sender: loggedInUserObjectId,
            receiver: profileUserId,
            status: "accepted",
          },
          {
            sender: profileUserId,
            receiver: loggedInUserObjectId,
            status: "accepted",
          },
        ],
      });

      if (isFriend) {
        // Show all posts if friends
        filterCondition = { userId: profileUserId };
      } else {
        // Show only public posts if not friends
        filterCondition = { userId: profileUserId, isPublic: true };
      }
    }

    // Fetch posts with pagination
    const userPosts = await Posts.aggregate([
      { $match: filterCondition },
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
              loggedInUserObjectId,
              { $map: { input: "$likes", as: "like", in: "$$like.userId" } },
            ],
          },
        },
      },
      {
        $project: {
          content: 1,
          createdOn: 1,
          visibility: 1,
          "user.username": 1,
          "user.miniImg": 1,
          "user.fullName": 1,
          likeCount: 1,
          commentCount: 1,
          isLikedByUser: 1,
        },
      },
    ]);

    // Get the total count of posts
    const totalPosts = await Posts.countDocuments(filterCondition);

    res.status(200).json({
      message: "User posts fetched successfully.",
      posts: userPosts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
