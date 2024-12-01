import { useEffect, useState } from "react";
import { axios } from "../Constants/constants";
import PostCard from "./UI/PostCard";
import { useSelector } from "react-redux";

const PublicPosts = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const {userId} = useSelector(state=>state.userAuth);
  useEffect(() => {
    const getPosts = async () => {
      const response = await axios.get("/posts/publicPosts", {
        params: {
          page: page,
          loggedInUserId: userId
        },
      });
      if (response.status === 200) {
        const postsList = response?.data?.posts || [];
        console.log(postsList);
        setPosts((prev) => [...prev, ...postsList]);
      }
    };
    getPosts();
  }, [page,userId]);
  return (
    <div>
      {posts.map((post, index) => {
        return <PostCard post={post} user={post?.user} key={index} />;
      })}
    </div>
  );
};

export default PublicPosts;
