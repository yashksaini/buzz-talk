/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Constants/constants";
import TopUsers from "../components/TopUsers";
import LineProfileCard from "../components/UI/LineProfileCard";
import NoDataFound from "../components/UI/NoDataFound";
import CreatePost from "../components/Posts/CreatePost";
import PublicPosts from "../components/PublicPosts";
import FriendsPosts from "../components/FriendsPosts";

const Dashboard = ({ socket }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const { userId } = useSelector((state) => state.userAuth);
  const [activeTab, setActiveTab] = useState("posts");

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
    socket.on("activeUsers", (data) => {
      setActiveUsers(data);
    });
  }, [socket]);

  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div className="sm:w-[600px] w-full max-w-full sm:border-r border-r-none sm:border-line h-full overflow-y-auto overflow-x-hidden sm:border-l">
          <div className="w-full bg-white z-10">
            <div className="w-full px-4 bg-white pt-3 flex justify-center items-start flex-col">
              <h1 className="text-2xl font-bold text-dark1 leading-7">
                Dashboard
              </h1>
              <p className="text-grayText leading-4 flex justify-start items-center gap-1 text-sm">
                Create your own posts, explore content, and engage .
              </p>
            </div>
            <div className="grid grid-cols-3 border-b border-line h-14 mt-2 bg-white">
              <button
                onClick={() => {
                  setActiveTab("posts");
                }}
                className={`${
                  activeTab === "posts" ? "active-tab" : ""
                } hover:bg-line text-mainText`}
              >
                Posts
              </button>
              <button
                onClick={() => {
                  setActiveTab("forYou");
                }}
                className={`${
                  activeTab === "forYou" ? "active-tab" : ""
                } hover:bg-line text-mainText`}
              >
                For You
              </button>
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
            </div>
          </div>
          {activeTab === "posts" && (
            <div className="mt-2">
              <CreatePost />
              <PublicPosts />
            </div>
          )}
          {activeTab === "forYou" && (
            <div className="mt-2">
              <FriendsPosts />
            </div>
          )}
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
        </div>

        <div className=" flex-1 bg-white h-full overflow-y-auto overflow-x-hidden px-0 lg:px-3 lg:block hidden">
          <TopUsers />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
