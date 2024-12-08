/* eslint-disable react/prop-types */
import { IoCloseOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProfileIcon from "../ProfileIcon";
import NoDataFound from "../UI/NoDataFound";

const LikesList = ({ likes, setShowLikes }) => {
  const { userId } = useSelector((state) => state.userAuth);
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full h-full bg-[rgba(0,0,0,0.40)] fixed top-0 left-0 z-[100] md:p-8 p-2 flex justify-center items-center">
        <div className="max-w-full w-[600px] bg-white rounded-xl h-[650px] max-h-full overflow-hidden ">
          <div className="w-full h-[650px] max-h-full overflow-x-hidden overflow-y-auto">
            <div className="flex justify-between items-center h-14 w-full sticky top-0 left-0 bg-white  z-50 px-3">
              <div className="flex justify-between items-center flex-1 gap-2 text-dark1">
                <h1 className="font-bold text-[20px] ">
                  Liked By {likes?.length > 0 && <span>({likes?.length})</span>}
                </h1>

                <button
                  onClick={() => setShowLikes(false)}
                  className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-line transition-all"
                >
                  <IoCloseOutline className="text-2xl" />
                </button>
              </div>
            </div>
            {/* Modal Body */}
            <div className="w-full border-b border-line">
              {likes?.map((like, index) => {
                const user = like?.userId;
                return (
                  <div key={index} className="w-full border-t border-line">
                    <Link
                      to={"/profile/" + user?.username}
                      key={user?.username}
                      className="w-full py-3 px-6 flex justify-start items-center gap-2 hover:bg-backgroundDark cursor-pointer"
                    >
                      <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
                        {!user?.miniImg && (
                          <ProfileIcon fullName={user?.fullName} />
                        )}
                        {user?.miniImg && (
                          <img
                            src={user?.miniImg}
                            alt="profile"
                            className="w-9 h-9 rounded-full"
                          />
                        )}
                      </div>
                      <div className="w-[calc(100%_-_52px)] h-10 flex justify-center items-start flex-col gap-[2px]">
                        <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold ">
                          {user?.fullName}
                        </p>
                        <p className="leading-4  text-mainText text-xs flex justify-between items-center w-full">
                          @{user?.username}{" "}
                          <span className="text-sm text-grayText px-6 mb-0">
                            {like?.likedOn
                              ? new Date(like?.likedOn).toLocaleDateString(
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
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
              {likes?.length === 0 && (
                <div className="border-t py-8 pb-16">
                  <NoDataFound
                    title={"No Likes"}
                    desc={"No Like on this post yet."}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LikesList;
