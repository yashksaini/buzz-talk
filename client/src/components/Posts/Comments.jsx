/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileIcon from "../ProfileIcon";
import { axios } from "../../Constants/constants";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import NoDataFound from "../UI/NoDataFound";

const Comments = ({ comments, setRefresh }) => {
  const { id } = useParams();
  const { userId, username } = useSelector((state) => state.userAuth);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const [isDisable, setIsDisable] = useState(true);
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textareaRef.current.value.trim() === "") {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to calculate the correct size
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
    }
  };
  const postComment = async () => {
    try {
      if (textareaRef.current.value.trim() === "") {
        toast.error("Please enter a content");
        return;
      }
      const response = await axios.post("/posts/addComment", {
        userId: userId,
        postId: id,
        content: textareaRef.current.value,
      });
      if (response.status === 200) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
        setRefresh((prev) => !prev);
      } else {
        console.error("Error creating comment:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/userImage/${username}`);
        if (!response.data) {
          return;
        }
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [username]);
  return (
    <>
      <div>
        <div className="flex justify-center items-start px-4 gap-1 border-b border-line">
          <div className="w-10 h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
            {userData?.imgUrl && (
              <img
                src={userData?.imgUrl}
                alt="profile"
                className="w-9 h-9 rounded-full"
              />
            )}
            {!userData?.imgUrl && <ProfileIcon fullName={userData?.fullName} />}
          </div>
          <div className="flex-1 ">
            <textarea
              ref={textareaRef}
              className="w-full text-base font-light px-3 py-1 outline-none"
              placeholder="Write your reply..."
              onInput={handleInput}
              style={{ resize: "none", overflow: "hidden" }} // Prevent manual resizing
            />
            <div className="flex justify-end items-center">
              <button
                className=" px-6 py-2 bg-primary my-2 text-white rounded-full disabled:bg-borderColor "
                onClick={postComment}
                disabled={isDisable}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mb-4">
        {comments?.length > 0 && (
          <div className="w-full flex justify-center items-center py-3 bg-transPrimary text-primary mb-4 border-b border-line">
            {comments?.length} Comments
          </div>
        )}
        {comments?.length > 0 &&
          comments?.map((comment) => (
            <div
              key={comment?.userId?.username}
              className={`w-full py-3 px-6 flex justify-start items-start gap-2 border-b border-line`}
            >
              <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
                {!comment?.userId?.miniImg && (
                  <ProfileIcon fullName={comment?.userId?.fullName} />
                )}
                {comment?.userId?.miniImg && (
                  <img
                    src={comment?.userId?.miniImg}
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
                      navigate("/profile/" + comment?.userId?.username);
                    }}
                  >
                    <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold hover:underline ">
                      {comment?.userId?.fullName}
                    </p>
                    <p className="leading-4  text-mainText text-xs ">
                      @{comment?.userId?.username}{" "}
                      <span className="ml-2 text-grayText">
                        {comment?.commentedOn
                          ? new Date(comment?.commentedOn).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              }
                            )
                          : ""}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-dark2 mt-1 text-base font-light">
                  {comment?.comment}
                </p>
              </div>
            </div>
          ))}
        {comments?.length === 0 && (
          <div className="flex justify-center items-center">
            <NoDataFound
              title="No Comments Yet"
              desc="Be the first to share your thoughts on this post."
            />
          </div>
        )}
        {/* Add comment form */}
      </div>
    </>
  );
};

export default Comments;
