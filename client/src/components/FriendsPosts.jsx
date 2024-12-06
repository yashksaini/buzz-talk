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
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
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
        setPosts((prev) => [...prev, ...postsList]);
        setTotalPages(response.data.totalPages);
        setPage(response.data.currentPage);
        setLoading(false);
      }
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  const fetchNextPage = async () => {
    setIsMoreLoading(true);
    try {
      const response = await axios.get("/posts/friendsPosts", {
        params: {
          page: page + 1,
          loggedInUserId: userId,
        },
      });
      if (response.status === 200) {
        const postsList = response?.data?.posts || [];
        setPosts((prev) => [...prev, ...postsList]);
        setPage(response.data.currentPage);
        setIsMoreLoading(false);
      }
    } catch (error) {
      console.error("Error fetching more public posts:", error);
      setIsMoreLoading(false);
    }
  };
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
      {!loading && page < totalPages && !isMoreLoading && (
        <div
          className="flex justify-center items-center w-full py-4 text-primary bg-backgroundDark cursor-pointer"
          onClick={fetchNextPage}
        >
          Load More
        </div>
      )}
      {(loading || isMoreLoading) && (
        <div className="flex justify-center items-center my-4">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default FriendsPosts;
