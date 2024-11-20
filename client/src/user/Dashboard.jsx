/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Constants/constants";
import TopUsers from "../components/TopUsers";
import LineProfileCard from "../components/UI/LineProfileCard";
import Loader from "../components/UI/Loader";
 import NoDataFound from "../components/UI/NoDataFound";

const Dashboard = ({ socket }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { userId } = useSelector((state) => state.userAuth);
  const [activeTab, setActiveTab] = useState("active");
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  useEffect(() => {
    const fetchInitialActiveUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/active-users`);
        setActiveUsers(response.data);
      } catch (error) {
        console.error("Error fetching initial active users:", error);
      }
    };
    fetchInitialActiveUsers();
  }, [userId]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsFetchingUsers(true);
      try {
        const response = await axios.get(`${BASE_URL}/users/all-users`, {
          params: {
            userId: userId,
          },
        });
        setAllUsers(response.data || []);
        setIsFetchingUsers(false);
      } catch (error) {
        console.error("Error fetching initial active users:", error);
        setIsFetchingUsers(false);
      }
    };
    fetchAllUsers();
  }, [userId]);

  useEffect(() => {
    socket.on("activeUsers", (data) => {
      setActiveUsers(data);
    });
  }, [socket]);

  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div className="w-[600px] border-r border-line h-full overflow-y-auto overflow-x-hidden">
          <div className="w-full px-4  sticky top-0 bg-white h-16 flex justify-center items-start flex-col z-10 ">
            <h1 className="text-2xl font-bold text-dark1 leading-7">
              Dashboard
            </h1>
            <p className="text-mainText leading-4 flex justify-start items-center gap-1 text-sm  overflow-hidden text-ellipsis whitespace-nowrap">
            Explore the comprehensive list of users on the platform below.
            </p>
          </div>
          <div className="grid grid-cols-2 border-b border-line h-14 mt-2">
            <button
              onClick={() => {
                setActiveTab("active");
              }}
              className={`${
                activeTab === "active" ? "active-tab" : ""
              } hover:bg-line text-mainText`}
            >
              Active Users
            </button>
            <button
              onClick={() => {
                setActiveTab("all");
              }}
              className={`${
                activeTab === "all" ? "active-tab" : ""
              } hover:bg-line text-mainText`}
            >
              Recent Users
            </button>
          </div>
            {activeTab === "active" && (
              <div className="mt-2">
                {activeUsers
                  ?.filter((a) => a.userId !== userId)
                  ?.map((user) => (
                    <LineProfileCard key={user.userId} user={{
                      userId: user.userId,
                      fullName: user.fullName,
                      username: user.username,
                      imgUrl: null,
                    }} />
                  ))}
                {activeUsers?.filter((a) => a.userId !== userId)?.length < 1 &&
                  <NoDataFound title={"No active users right now"} desc={"It seems no one is active on the platform currently. Check back later to connect with users in real-time."}/>}
              </div>
            )}
            {activeTab === "all" && (
              <div className="mt-2">
                {!isFetchingUsers && allUsers
                  ?.map((user) => (
                    <LineProfileCard key={user.userId} user={user} />
                  ))}
                {!isFetchingUsers && allUsers?.length < 1 &&
                  <NoDataFound title={"Invite your friends to this platform"} desc={"Spread the word! Invite your friends and colleagues to join this platform and grow your network."}/>}
                {isFetchingUsers && <div className="my-8 flex justify-center items-center"><Loader/></div>}
              </div>
            )}
        </div>

        <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden px-3">
          <TopUsers />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
