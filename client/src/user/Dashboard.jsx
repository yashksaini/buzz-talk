/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Constants/constants";

const Dashboard = ({ socket }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const { fullName } = useSelector((state) => state.userAuth);

  useEffect(() => {
    const fetchInitialActiveUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/active-users`);
        setActiveUsers(response.data);
        console.log("Active users", response.data);
      } catch (error) {
        console.error("Error fetching initial active users:", error);
      }
    };

    fetchInitialActiveUsers();
  }, []);

  useEffect(() => {
    socket.on("activeUsers", (data) => {
      console.log("Active users", data);
      setActiveUsers(data);
    });
  }, [socket]);

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
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
  );
};

export default Dashboard;
