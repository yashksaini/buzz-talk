/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Constants/constants";
import TopUsers from "../components/TopUsers";

const Dashboard = ({ socket }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const { fullName } = useSelector((state) => state.userAuth);
  const [activeTab,setActiveTab] = useState("all");

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
  }, []);

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
          <h1 className="text-2xl font-bold text-dark1 leading-7">Dashboard</h1>
          <p className="text-mainText leading-4 flex justify-start items-center gap-1 text-sm  overflow-hidden text-ellipsis whitespace-nowrap">
            All users list appear below
          </p>
        </div>
        <div className="grid grid-cols-2 border-b border-line h-14 mt-2">
      
        <button
          onClick={() => {
            setActiveTab("live");
          }}
          className={`${
            activeTab === "live" ? "active-tab" : ""
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
        >Platform Users
        </button>
    </div>
      <div>
        {activeUsers?.map((user) => (
          <Link
            to={`/profile/${user.username}`}
            key={user.userId}
            className="block p-4 m-2 bg-blue-500 text-white rounded"
          >
            {user.fullName === fullName ? "You" : user.fullName}{" "}
            {user.isLive ? "(Live)" : ""}
          </Link>
        ))}
       </div>
        </div>

        <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden px-3">
          <TopUsers />
        </div>
      </div></>
  );
};

export default Dashboard;
