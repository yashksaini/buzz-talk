/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import ProfileIcon from "../ProfileIcon";
import { Fragment } from "react";
// import { useEffect, useRef, useState } from "react";
// import { BiUser } from "react-icons/bi";
const PostCard = ({
  user,post
}) => {
//   const navigate = useNavigate();
const formatWithLineBreaks = (input) => {
    return input?.split("\n").map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
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
              @{user?.username} <span className="ml-2 text-grayText">{post?.createdOn
                      ? new Date(post?.createdOn).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )
                      : ""}</span>
            </p>
          </Link>
        </div>
        <p className="text-dark1 mt-1 text-xl font-light">
        {formatWithLineBreaks(post?.content || "")}
        </p>
      </div>
    </div>
  );
};
export default PostCard;
