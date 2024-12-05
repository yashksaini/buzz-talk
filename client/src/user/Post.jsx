import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TopUsers from "../components/TopUsers";
import { axios } from "../Constants/constants";
import ProfileIcon from "../components/ProfileIcon";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { BsChat } from "react-icons/bs";
import { IoMdArrowBack } from "react-icons/io";
import Comments from "../components/Posts/Comments";
import Loader from "../components/UI/Loader";
import NoDataFound from "../components/UI/NoDataFound";

const Post = () => {
  const [postData, setPostData] = useState({});
  const { id } = useParams();
  const { userId } = useSelector((state) => state.userAuth);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [refresh, setRefresh] = useState(true);
  const [postExists, setPostExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const isLikedByUser = (post) => {
    const isLiked = post?.likes?.some((like) => like?.userId?._id === userId);
    setLikeCount(post?.likes?.length);
    setLiked(isLiked);
  };
  const toggleLike = async () => {
    setLiked((prevLiked) => !prevLiked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    await axios.post("/posts/toggleLike", {
      postId: postData._id,
      userId: userId,
    });
  };
  const navigate = useNavigate();
  const formatWithLineBreaks = (input) => {
    return input?.split("\n").map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/posts/getPostById`, {
          params: {
            postId: id,
            userId: userId,
          },
        });
        if (response?.data) {
          isLikedByUser(response?.data?.post);
          setPostData(response?.data?.post);
          if (response?.data?.post) {
            setPostExists(true);
          } else {
            setPostExists(false);
          }
        } else {
          setPostExists(false);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
        setPostExists(false);
      }
    };
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId, refresh]);
  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div className="sm:w-[600px] w-full max-w-full sm:border-r border-r-none sm:border-line h-full overflow-y-auto overflow-x-hidden sm:border-l">
          {!loading && postExists && (
            <>
              <div className="sticky top-0 left-0 h-12 gap-3 px-3 bg-white/80 backdrop-blur-sm z-10 flex justify-start items-center border-b border-line">
                <button
                  onClick={() => {
                    navigate("/");
                  }}
                  className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-line transition-all"
                >
                  <IoMdArrowBack className="text-2xl" />
                </button>
                <h1 className="font-bold text-[20px] ">Post </h1>
              </div>
              <div
                key={postData?.userId?.username}
                className={`w-full py-3 px-6 flex justify-start items-start gap-2 `}
              >
                <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
                  {!postData?.userId?.miniImg && (
                    <ProfileIcon fullName={postData?.userId?.fullName} />
                  )}
                  {postData?.userId?.miniImg && (
                    <img
                      src={postData?.userId?.miniImg}
                      alt="profile"
                      className="w-9 h-9 rounded-full"
                    />
                  )}
                </div>
                <div className="w-[calc(100%_-_52px)] ">
                  <div className=" h-10 flex justify-between items-center  gap-[2px]">
                    <div
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/profile/" + postData?.userId?.username);
                      }}
                    >
                      <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold hover:underline ">
                        {postData?.userId?.fullName}
                      </p>
                      <p className="leading-4  text-mainText text-xs ">
                        @{postData?.userId?.username}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 border-b border-line py-3">
                <p className="text-dark2 mt-1 text-xl font-light">
                  {formatWithLineBreaks(postData?.content || "")}
                </p>
              </div>
              <div className="px-6 border-b border-line py-3">
                <span className="text-dark2 text-base">
                  {postData?.createdOn
                    ? new Date(postData?.createdOn).toLocaleDateString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : ""}
                </span>
              </div>
              <div className="flex justify-start items-center gap-2 mb-2 select-none px-6 border-b border-line py-2">
                <div
                  className={`flex justify-center items-center gap-1 group hover:text-pink cursor-pointer  ${
                    liked ? "text-pink" : "text-dark1"
                  }`}
                  onClick={toggleLike}
                >
                  <span
                    className={`flex justify-center items-center w-9 h-9 rounded-full group-hover:bg-transPink `}
                  >
                    {liked ? <GoHeartFill /> : <GoHeart />}
                  </span>
                  <span className="flex justify-center items-center h-9 min-w-9 ml-[-12px]">
                    {likeCount}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-1 group text-primary cursor-pointer ">
                  <span className="flex justify-center items-center w-9 h-9 rounded-full group-hover:bg-transPrimary ">
                    <BsChat />
                  </span>
                  <span className=" flex justify-center items-center h-9 min-w-9 ml-[-12px]">
                    {postData?.comments?.length || 0}
                  </span>
                </div>
              </div>
              <Comments comments={postData?.comments} setRefresh={setRefresh} />
            </>
          )}
          {!loading && !postExists && (
            <div>
              <div className="sticky top-0 left-0 h-12 gap-3 px-3 bg-white/80 backdrop-blur-sm z-10 flex justify-start items-center border-b border-line">
                <button
                  onClick={() => {
                    navigate("/");
                  }}
                  className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-line transition-all"
                >
                  <IoMdArrowBack className="text-2xl" />
                </button>
                <h1 className="font-bold text-[20px] ">Post </h1>
              </div>
              <div className="w-full flex justify-center items-end pb-4">
                <NoDataFound
                  title={"Post Not Found"}
                  desc={
                    "The post you are looking for does not exist or may have been removed."
                  }
                />
              </div>
            </div>
          )}
          {loading && (
            <>
              <div className="sticky top-0 left-0 h-12 gap-3 px-3 bg-white/80 backdrop-blur-sm z-10 flex justify-start items-center border-b border-line">
                <button
                  onClick={() => {
                    navigate("/");
                  }}
                  className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-line transition-all"
                >
                  <IoMdArrowBack className="text-2xl" />
                </button>
                <h1 className="font-bold text-[20px] ">Post </h1>
              </div>
              <div className="w-full flex justify-center items-end py-4">
                <Loader />
              </div>
            </>
          )}
        </div>

        <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden sm:px-3 px-0 lg:block hidden">
          <TopUsers />
        </div>
      </div>
    </>
  );
};

export default Post;
