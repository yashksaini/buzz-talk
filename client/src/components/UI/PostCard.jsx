/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import ProfileIcon from "../ProfileIcon";
import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { BsChat } from "react-icons/bs";
import { axios } from "../../Constants/constants";
import { useSelector } from "react-redux";
// import { useEffect, useRef, useState } from "react";
// import { BiUser } from "react-icons/bi";
const PostCard = ({ post }) => {
  const user = post?.user;
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.userAuth);
  const [liked, setLiked] = useState(post?.isLikedByUser || false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const toggleLike = async (e) => {
    e.stopPropagation();
    setLiked((prevLiked) => !prevLiked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    await axios.post("/posts/toggleLike", {
      postId: post._id,
      userId: userId,
    });
  };
  return (
    <div
      key={user?.username}
      className={`w-full py-3 px-6 flex justify-start items-start gap-2 border-b border-line hover:bg-backgroundDark transition-all duration-500 hover:cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/post/${post._id}`);
      }}
    >
      <div
        className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary"
        onClick={(e) => {
          e.stopPropagation();
          navigate("/profile/" + user?.username);
        }}
      >
        {!user?.miniImg && <ProfileIcon fullName={user?.fullName} />}
        {user?.miniImg && (
          <img
            src={user?.miniImg}
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
              navigate("/profile/" + user?.username);
            }}
          >
            <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold hover:underline ">
              {user?.fullName}
            </p>
            <p className="leading-4  text-mainText text-xs ">
              @{user?.username}{" "}
              <span className="ml-2 text-grayText">
                {post?.createdOn
                  ? new Date(post?.createdOn).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : ""}
              </span>
            </p>
          </div>
        </div>
        <p className="text-dark2 mt-1 text-xl">
          {post?.content?.slice(0, 100)}
          {post?.content?.length > 100 && (
            <span className="ml-1 text-dark1 font-medium hover:underline underline-offset-2">
              ... read more
            </span>
          )}
        </p>
        <div className="flex justify-start items-center gap-2 mt-3 mb-2 select-none">
          <div
            className={`flex justify-center items-center gap-1 group hover:text-pink cursor-pointer  ${
              liked ? "text-pink" : "text-dark1"
            }`}
            onClick={(e) => {
              toggleLike(e);
            }}
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
          <div className="flex justify-center items-center gap-1 group hover:text-primary cursor-pointer text-dark1">
            <span className="flex justify-center items-center w-9 h-9 rounded-full group-hover:bg-transPrimary ">
              <BsChat />
            </span>
            <span className=" flex justify-center items-center h-9 min-w-9 ml-[-12px]">
              {post?.commentCount || 0}
            </span>
          </div>
          <div className="text-sm text-grayText flex-1 flex justify-end items-center">
            <span>
              {post?.isPublic ? (
                <span className="text-primary">Public</span>
              ) : (
                <span>Friends Only</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
