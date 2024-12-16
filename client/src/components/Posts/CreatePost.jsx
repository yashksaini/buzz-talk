import { useEffect, useRef, useState } from "react";
import { axios } from "../../Constants/constants";
import { useSelector } from "react-redux";
import ProfileIcon from "../ProfileIcon";
import Switch from "../mini/Switch";
import { toast } from "react-toastify";
import CustomSkeleton from "../UI/CustomSkeleton";

// eslint-disable-next-line react/prop-types
const CreatePost = ({ setRefresh }) => {
  const { username, userId } = useSelector((state) => state.userAuth);
  const [isPublic, setIsPublic] = useState(true);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to calculate the correct size
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
    }
  };
  const createPost = async () => {
    try {
      if (textareaRef.current.value.trim() === "") {
        toast.error("Please enter a content");
        return;
      }
      const response = await axios.post("/posts/createPost", {
        userId,
        content: textareaRef.current.value,
        isPublic,
      });
      if (response.status === 200) {
        // Clear the textarea and reset the height
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
        if (isPublic) {
          setRefresh((prev) => !prev);
        }
        toast.success("Post created successfully");
      } else {
        console.error("Error creating post:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/userImage/${username}`);
        if (!response.data) {
          return;
        }
        setUserData(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [username]);
  return (
    <div className="flex justify-center items-start px-4 gap-1 border-b border-line">
      {!isLoading && (
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
      )}

      {isLoading && <CustomSkeleton className="w-10 h-10 rounded-full" />}
      <div className="flex-1 ">
        <textarea
          ref={textareaRef}
          className="w-full text-xl px-3 py-1 outline-none text-dark1"
          placeholder="What's on your mind"
          onInput={handleInput}
          style={{ resize: "none", overflow: "hidden" }} // Prevent manual resizing
        />
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center gap-2">
            <span className="text-sm text-grayText">Public</span>
            <Switch isChecked={isPublic} setIsChecked={setIsPublic} />
          </div>

          <button
            className="self-end px-6 py-2 bg-primary my-2 text-white rounded-full"
            onClick={createPost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
