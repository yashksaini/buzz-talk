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
        <div className="sm:w-[600px] w-full max-w-full sm:border-r border-r-none sm:border-line h-full overflow-y-auto overflow-x-hidden sm:border-l">
          <div className="w-full sticky top-0 bg-white z-10">
            <div className="w-full px-4 bg-white min-h-16 flex justify-center items-start flex-col">
              <h1 className="text-2xl font-bold text-dark1 leading-7">
                Dashboard
              </h1>
              <p className="text-mainText leading-4 flex justify-start items-center gap-1 text-sm">
                Explore the list of users on the platform below.
              </p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-2 border-b border-line h-14 mt-2 bg-white">
              <button
                onClick={() => {
                  setActiveTab("active");
                }}
                className={`${
                  activeTab === "active" ? "active-tab" : ""
                } hover:bg-line text-mainText`}
              >
                Active
              </button>
              <button
                onClick={() => {
                  setActiveTab("all");
                }}
                className={`${
                  activeTab === "all" ? "active-tab" : ""
                } hover:bg-line text-mainText`}
              >
                Recent 
              </button>
              <button
                onClick={() => {
                  setActiveTab("search");
                }}
                className={`${
                  activeTab === "search" ? "active-tab" : ""
                } hover:bg-line text-mainText md:hidden block`}
              >
                Search
              </button>
            </div>
          </div>

          {activeTab === "active" && (
            <div className="mt-2">
              {activeUsers
                ?.filter((a) => a.userId !== userId)
                ?.map((user) => (
                  <LineProfileCard
                    key={user.userId}
                    user={{
                      userId: user.userId,
                      fullName: user.fullName,
                      username: user.username,
                      imgUrl: null,
                    }}
                  />
                ))}
              {activeUsers?.filter((a) => a.userId !== userId)?.length < 1 && (
                <NoDataFound
                  title={"No active users right now"}
                  desc={
                    "It seems no one is active on the platform currently. Check back later to connect with users in real-time."
                  }
                />
              )}
            </div>
          )}
          {activeTab === "all" && (
            <div className="mt-2">
              {!isFetchingUsers &&
                allUsers?.map((user) => (
                  <LineProfileCard key={user.userId} user={user} />
                ))}
              {!isFetchingUsers && allUsers?.length < 1 && (
                <NoDataFound
                  title={"Invite your friends to this platform"}
                  desc={
                    "Spread the word! Invite your friends and colleagues to join this platform and grow your network."
                  }
                />
              )}
              {isFetchingUsers && (
                <div className="my-8 flex justify-center items-center">
                  <Loader />
                </div>
              )}
            </div>
          )}
          {activeTab === "search" && <TopUsers/>}
        </div>

        <div className=" flex-1 bg-white h-full overflow-y-auto overflow-x-hidden px-0 lg:px-3 lg:block hidden">
          <TopUsers />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
