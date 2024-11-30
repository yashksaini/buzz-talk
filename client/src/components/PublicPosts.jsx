import { useEffect, useState } from "react";
import { axios } from "../Constants/constants";
import PostCard from "./UI/PostCard";

const PublicPosts = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      const response = await axios.get("/posts/publicPosts", {
        params: {
          page: page,
        },
      });
      if (response.status === 200) {
        const postsList = response?.data?.posts || [];
        console.log(postsList);
        setPosts((prev) => [...prev, ...postsList]);
      }
    };
    getPosts();
  }, [page]);
  return (
    <div>
      {posts.map((post, index) => {
        return <PostCard post={post} user={post?.userId} key={index} />;
      })}
    </div>
  );
};

export default PublicPosts;
