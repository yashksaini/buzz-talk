/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../main";
import { useSelector } from "react-redux";

const Profile = ({ socket }) => {
  const [userData, setUserData] = useState({});
  const { id } = useParams();
  const { fullName, userId } = useSelector((state) => state.userAuth);
  const [userExists, setUserExists] = useState(true);

  useEffect(() => {
    // Fetch user data based on the userId
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${id}`);
        if (!response.data) {
          setUserExists(false);
          return;
        }

        setUserData(response.data);

        // Emit a "profileVisit" event when the user's profile is visited
        if (userId !== id) {
          socket.emit("profileVisit", {
            visitedUserId: id,
            visitorName: fullName, // Send the name of the visitor
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserExists(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="container mx-auto max-w-screen-md mt-8">
      {userExists ? (
        <div className="bg-white p-8 rounded-md shadow-md">
          <h1 className="text-3xl font-bold mb-4">User Profile</h1>
          <p>
            <strong>Full Name:</strong> {userData.fullName}
          </p>
          <p>
            <strong>Username:</strong> {userData.username}
          </p>
          {/* Add any other user data fields you want to display */}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-md shadow-md">
          <p className="text-xl text-gray-700">
            This user doesn&apos;t exist or an error occurred while fetching the
            data.
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
