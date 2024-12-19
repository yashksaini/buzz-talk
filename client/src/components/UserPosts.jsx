import { useEffect, useState } from "react";
import { axios } from "../Constants/constants";
import PostCard from "./UI/PostCard";
import { useSelector } from "react-redux";
import NoDataFound from "./UI/NoDataFound";
import Loader from "./UI/Loader";
import { useParams } from "react-router-dom";

const UserPosts = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { userId } = useSelector((state) => state.userAuth);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const response = await axios.get("/posts/getAllPostsOfUser", {
        params: {
          page: page,
          loggedInUserId: userId,
          username: id,
        },
      });
      if (response.status === 200) {
        const postsList = response?.data?.posts || [];
        setPosts(postsList);
        setTotalPages(response.data.totalPages);
        setPage(response.data.currentPage);
        setTotalPosts(response.data.totalPosts);
        setLoading(false);
      }
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, id]);
  const fetchNextPage = async () => {
    setIsMoreLoading(true);
    try {
      const response = await axios.get("/posts/getAllPostsOfUser", {
        params: {
          page: page + 1,
          loggedInUserId: userId,
          username: id,
        },
      });
      if (response.status === 200) {
        const postsList = response?.data?.posts || [];
        setPosts((prev) => [...prev, ...postsList]);
        setPage(response.data.currentPage);
        setIsMoreLoading(false);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
      setIsMoreLoading(false);
    }
  };
  return (
    <div>
      {!loading && (
        <div className="w-full py-4 flex justify-center items-center text-primary bg-backgroundDark border-b border-line">
          {totalPosts > 0 && totalPosts}{" "}
          <span className="ml-1">
            Post{(totalPosts > 1 || totalPosts === 0) && "s"}
          </span>
        </div>
      )}
      {!loading &&
        posts.map((post, index) => {
          return <PostCard post={post} key={index} />;
        })}
      {!loading && posts?.length === 0 && (
        <div className="w-full flex justify-center items-center my-4 mb-8">
          <NoDataFound
            title={"No Posts Yet"}
            desc={"User haven’t shared any posts yet."}
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

export default UserPosts;
