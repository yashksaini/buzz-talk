import { useEffect, useState } from "react";
import { friendsTabsList } from "../../Constants/friendsConstants";
import PropTypes from "prop-types";
import { axios } from "../../Constants/constants";
import { useSelector } from "react-redux";
const FriendsTabs = ({ activeTab, setActiveTab, isUpdated }) => {
  const { userId } = useSelector((state) => state.userAuth);
  const [dataCount, setDataCount] = useState({
    sent: 0,
    friends: 0,
    requests: 0,
  });
  useEffect(() => {
    const getFriendships = async () => {
      try {
        const response = await axios.get("/friends/getAllFriendsStatus", {
          params: {
            ownerId: userId,
          },
        });
        if (response?.data) {
          setDataCount(response.data);
        }
      } catch (error) {
        console.error("Error in fetching friendships", error);
      }
    };
    getFriendships();
  }, [userId, isUpdated]);
  return (
    <div className="grid grid-cols-3 border-b border-line h-14 mt-2">
      {Object.entries(friendsTabsList).map(([key, value]) => (
        <button
          key={key}
          onClick={() => {
            setActiveTab(value);
          }}
          className={`${
            activeTab === value ? "active-tab" : ""
          } hover:bg-line text-mainText`}
        >
          {value}{" "}
          {dataCount[key] !== 0 && (
            <span className="inline-flex justify-center items-center bg-line text-primary rounded-full ml-2 aspect-square w-6 text-sm font-semibold">
              {dataCount[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
FriendsTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  isUpdated: PropTypes.bool,
};
export default FriendsTabs;
