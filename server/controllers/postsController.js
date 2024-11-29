import { Posts } from "../schemas/schemas.js";

export const createPost = async(req,res)=>{
        try {
          const { content, isPublic,userId } = req.body;
      
          // Validate required fields
          if (!content) {
            return res.status(400).json({ message: 'Content is required.' });
          }
      
          // Create a new post
          const newPost = new Posts({
            userId,
            content,
            isPublic: isPublic , 
          });
      
          // Save the post to the database
          await newPost.save();
      
          res.status(200).json({
            message: 'Post created successfully.',
          });
        } catch (error) {
          console.error('Error creating post:', error);
          res.status(500).json({ message: 'Internal server error.' });
        }
}