import { useEffect, useState } from "react";
import { axios } from "../Constants/constants";
import PostCard from "./UI/PostCard";
import { useSelector } from "react-redux";
import Loader from "./UI/Loader";

// eslint-disable-next-line react/prop-types
const PublicPosts = ({ refresh }) => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const { userId } = useSelector((state) => state.userAuth);
  const [loading, setLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
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
          setPosts(postsList);
          setTotalPages(response.data.totalPages);
          setPage(response.data.currentPage);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching public posts:", error);
        setLoading(false);
      }
    };
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, refresh]);
  const fetchNextPage = async () => {
    setIsMoreLoading(true);
    try {
      const response = await axios.get("/posts/publicPosts", {
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
          return <PostCard post={post} key={index} />;
        })}
      {!loading && page < totalPages && !isMoreLoading && (
        <div
          className="flex justify-center items-center w-full py-4 text-primary bg-transPrimary cursor-pointer"
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

export default PublicPosts;
