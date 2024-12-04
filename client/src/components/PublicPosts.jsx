import { useEffect, useState } from "react";
import { axios } from "../Constants/constants";
import PostCard from "./UI/PostCard";
import { useSelector } from "react-redux";
import Loader from "./UI/Loader";

const PublicPosts = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const { userId } = useSelector((state) => state.userAuth);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/posts/publicPosts", {
          params: {
            page: page,
            loggedInUserId: userId,
          },
        });
        if (response.status === 200) {
          const postsList = response?.data?.posts || [];
          console.log(postsList);
          setPosts((prev) => [...prev, ...postsList]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching public posts:", error);
        setLoading(false);
      }
    };
    getPosts();
  }, [page, userId]);
  return (
    <div>
      {!loading &&
        posts.map((post, index) => {
          return <PostCard post={post} user={post?.user} key={index} />;
        })}
      {loading && (
        <div className="flex justify-center items-center my-4">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default PublicPosts;
