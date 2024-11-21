import { useState } from "react";
import { friendsTabsList } from "../Constants/friendsConstants";
import FriendsTabs from "../components/Friends/FriendsTabs";
import MyFriends from "../components/Friends/MyFriends";
import Requests from "../components/Friends/Requests";
import Sent from "../components/Friends/Sent";
// import Blocked from "../components/Friends/Blocked";
import TopUsers from "../components/TopUsers";

const Friends = () => {
  const [activeTab, setActiveTab] = useState(friendsTabsList.friends);
  const [isUpdated,setIsUpdated] = useState(false);
  return (
    <div className="flex justify-center items-center h-full">
      <div className="sm:w-[600px] w-full max-w-full sm:border-r border-r-none sm:border-line h-full overflow-y-auto overflow-x-hidden sm:border-l">
        <div className="sticky top-0 bg-white z-10">
        <div className="w-full px-4  bg-white h-16 flex justify-center items-start flex-col ">
          <h1 className="text-2xl font-bold text-dark1 leading-7">Friends</h1>
          <p className="text-mainText leading-4 flex justify-start items-center gap-1 text-sm  overflow-hidden text-ellipsis whitespace-nowrap">
            All your friends list appear below
          </p>
          </div>
          <FriendsTabs activeTab={activeTab} setActiveTab={setActiveTab} isUpdated={isUpdated} />
        </div>
        
        {activeTab === friendsTabsList.friends && <MyFriends setIsUpdated={setIsUpdated} />}
        {activeTab === friendsTabsList.requests && <Requests setIsUpdated={setIsUpdated} />}
        {activeTab === friendsTabsList.sent && <Sent setIsUpdated={setIsUpdated}/>}
        {/* {activeTab === friendsTabsList.blocked && <Blocked />} */}
      </div>
      <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden sm:px-3 px-0 lg:block hidden">
        <TopUsers />
      </div>
    </div>
  );
};

export default Friends;
