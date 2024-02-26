/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../main";
import { useSelector } from "react-redux";
import { IoCalendarOutline } from "react-icons/io5";
import TopUsers from "../components/TopUsers";
import EditProfileModal from "../components/EditProfileModal";
const Profile = ({ socket }) => {
  const [userData, setUserData] = useState({});
  const { id } = useParams();
  const { fullName, userId } = useSelector((state) => state.userAuth);
  const [userExists, setUserExists] = useState(true);
  const [modalType, setModalType] = useState("");

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
        console.log(response.data);

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
  }, [userId, modalType]);

  const formatWithLineBreaks = (input) => {
    return input?.split("\n").map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-[600px] border-r border-line h-full overflow-y-auto overflow-x-hidden">
        <div className="w-full px-4  sticky top-0 bg-white h-16 flex justify-center items-start flex-col z-10">
          <h1 className="text-2xl font-bold text-dark1 leading-7">
            {userData?.fullName}
          </h1>
          <p className="text-mainText leading-4 flex justify-start items-center gap-1 text-sm  overflow-hidden text-ellipsis whitespace-nowrap">
            {userData?.status}
          </p>
        </div>
        <div className="h-[200px] w-full bg-slate-200 relative z-10">
          {userData?.banner && (
            <img
              className="w-full h-full absolute top-0 left-0 z-20"
              alt="Banner"
              src={userData?.banner}
            />
          )}
          <div className="absolute bottom-[-72px] left-5 w-36 h-36  border-white border-4 rounded-full bg-slate-300 z-30">
            {userData?.imgUrl && (
              <img
                className="w-full h-full absolute top-0 left-0 z-20 rounded-full"
                alt="Profile"
                src={userData?.imgUrl}
              />
            )}
          </div>
        </div>
        <div className="flex justify-end items-start h-20">
          {userId === userData?.userId && (
            <button
              className="mt-2 mr-2 rounded-full border border-borderColor font-semibold px-4 py-1.5 hover:bg-line"
              onClick={() => {
                setModalType("edit");
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
        <div className="px-3 pb-4 border-b border-line">
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-dark1 leading-6">
              {userData?.fullName}
            </h2>
            <p className="text-mainText">@{userData?.username}</p>
          </div>
          <div className="mb-2 ">
            <p className="text-mainText">
              {formatWithLineBreaks(userData?.about || "")}
            </p>
          </div>
          <div className="mb-2 ">
            <p className="text-mainText flex justify-start items-center gap-2">
              <IoCalendarOutline />
              <b>Joined</b>
              {userData?.dateJoined
                ? new Date(userData.dateJoined).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden px-3">
        <TopUsers />
      </div>
      {modalType === "edit" && (
        <EditProfileModal setModalType={setModalType} user={userData} />
      )}
    </div>
  );
};

export default Profile;
