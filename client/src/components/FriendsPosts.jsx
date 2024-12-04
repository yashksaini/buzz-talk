import { useEffect, useState } from "react";
import { axios } from "../Constants/constants";
import PostCard from "./UI/PostCard";
import { useSelector } from "react-redux";
import NoDataFound from "./UI/NoDataFound";
import Loader from "./UI/Loader";

const FriendsPosts = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useSelector((state) => state.userAuth);
  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const response = await axios.get("/posts/friendsPosts", {
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
    };
    getPosts();
  }, [page, userId]);
  return (
    <div>
      {!loading &&
        posts.map((post, index) => {
          return <PostCard post={post} user={post?.user} key={index} />;
        })}
      {!loading && posts?.length === 0 && (
        <div className="w-full flex justify-center items-center my-4">
          <NoDataFound
            title={"No Posts Yet"}
            desc={"Your friends haven’t shared any posts yet."}
          />
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center my-4">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default FriendsPosts;
