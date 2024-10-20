import { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IoSettingsOutline } from "react-icons/io5";
import { BASE_URL } from "../main";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../components/UI/Loader";
import NoDataFound from "../components/UI/NoDataFound";
import FriendsChatCard from "../components/UI/FriendsChatCard";
const MyChats = () => {
  const { userId } = useSelector((state) => state.userAuth);
  const [search, setSearch] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleSearch = () => {};
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/friends/getFriendsList`, {
          params: {
            ownerId: userId,
          },
        });
        if (response.data) {
          setFriendsList(response?.data?.friends || []);
          setLoading(false);
        }
      } catch (error) {
        console.log("ERROR in fetching friends", error);
        setLoading(false);
      }
    };
    fetchFriends();
  }, [userId]);
  return (
    <>
      <div className="flex justify-center items-center h-full">
        {/* Friends List */}
        <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden border-r border-line text-dark1">
          {/* Top Section */}
          <div className="px-3">
            <div className="w-full flex justify-between items-center py-2">
              <span className="text-2xl font-bold text-dark1 leading-7 min-w-48">
                Messages
              </span>
              <span className="hover:bg-line p-2 rounded-full">
                <IoSettingsOutline
                  className="text-xl cursor-pointer"
                  data-tooltip-id="settings-tip"
                />
              </span>

              <ReactTooltip
                id="settings-tip"
                place="bottom"
                content="Settings"
                style={{
                  zIndex: "50",
                }}
              />
            </div>
            <div className="w-full bg-white">
              <div className="w-full h-12 bg-white rounded-full border border-borderColor flex justify-center items-center gap-3 pl-3 pr-2 focus-within:bg-white focus-within:border-primaryBorder ">
                <search className="text-2xl group:focus-within text-primary " />
                <input
                  type="text"
                  placeholder="Search Direct Messages..."
                  className="flex-1 bg-transparent focus:outline-none text-dark1 font-medium"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <button
                  onClick={handleSearch}
                  className="bg-dark2 text-white h-8 px-4 rounded-full"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          {/* Friends List */}
          <div className="mt-4">
            {loading && (
              <div className="w-full flex justify-center items-center min-h-40">
                <Loader />
              </div>
            )}
            {!loading &&
              friendsList?.map((friend, index) => {
                return (
                  <FriendsChatCard
                    user={{
                      _id: friend._id,
                      fullName: friend.fullName,
                      username: friend.username,
                      imgUrl: friend.imgUrl,
                    }}
                    key={index}
                  />
                );
              })}
            {!loading && friendsList.length === 0 && (
              <NoDataFound
                title="No Friends"
                desc="You haven't added any friends yet. Once you connect with others, your friends will appear here."
              />
            )}
          </div>
        </div>
        {/* Chat Area */}
        <div className="w-[600px] border-r border-line h-full overflow-y-auto overflow-x-hidden">
          Chat Area
        </div>
      </div>
    </>
  );
};

export default MyChats;
