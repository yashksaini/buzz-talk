/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import ProfileIcon from "../ProfileIcon";
import { Fragment, useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { BsChat } from "react-icons/bs";
// import { useEffect, useRef, useState } from "react";
// import { BiUser } from "react-icons/bi";
const PostCard = ({ user, post }) => {
  //   const navigate = useNavigate();
  const [liked, setLiked] = useState(post?.isLikedByUser || false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const formatWithLineBreaks = (input) => {
    return input?.split("\n").map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };
  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked((prevLiked) => !prevLiked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    // Optional: Call an API to store like status or update global state
  };
  return (
    <div
      key={user?.username}
      className={`w-full py-3 px-6 flex justify-start items-start gap-2 border-b border-line`}
    >
      <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
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
          <Link to={"/profile/" + user?.username}>
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
          </Link>
        </div>
        <p className="text-dark2 mt-1 text-xl font-light">
          {formatWithLineBreaks(post?.content || "")}
        </p>
        <div className="flex justify-start items-center gap-2 mt-3 mb-2 select-none">
          <div className={`flex justify-center items-center gap-1 group hover:text-pink cursor-pointer  ${liked?"text-pink" :"text-dark1"}`} onClick={(e) => {
            toggleLike(e);
          }}>
            <span className={`flex justify-center items-center w-9 h-9 rounded-full group-hover:bg-transPink `}>
              {liked ? <GoHeartFill /> : <GoHeart />}
            </span>
            <span className="flex justify-center items-center h-9 min-w-9 ml-[-12px]">{likeCount}</span>
          </div>
          <div className="flex justify-center items-center gap-1 group hover:text-primary cursor-pointer text-dark1">
            <span className="flex justify-center items-center w-9 h-9 rounded-full group-hover:bg-transPrimary ">
              <BsChat />
            </span>
            <span  className=" flex justify-center items-center h-9 min-w-9 ml-[-12px]">{post?.commentCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
