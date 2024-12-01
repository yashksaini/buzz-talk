import { Posts } from "../schemas/schemas.js";

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
    const { page = 1,loggedInUserId } = req.query;
    const limit = 5; // Number of posts per page
    const skip = (page - 1) * limit;

    // Find public posts with pagination and populate user details
    // const publicPosts = await Posts.find({ isPublic: true })
    //   .sort({ createdOn: -1 }) // Sort by newest first
    //   .skip(skip) // Skip posts based on the current page
    //   .limit(limit) // Limit the number of posts to 5
    //   .populate("userId", "username miniImg fullName");
      
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
            isLikedByUser: { $in: [loggedInUserId, "$likes"] }, // Check if the user has liked the post
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
