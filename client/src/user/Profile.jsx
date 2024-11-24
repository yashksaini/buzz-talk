/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoCalendarOutline } from "react-icons/io5";
import TopUsers from "../components/TopUsers";
import EditProfileModal from "../components/EditProfileModal";
import CustomSkeleton from "../components/UI/CustomSkeleton";
import { friendshipStatuses } from "../Constants/friendsConstants";
import { toast } from "react-toastify";
import {
  acceptFriendship,
  sendRequest,
  withdrawFriendReq,removeFriendship
} from "../components/commonFunctions";
import MiniModal from "../components/UI/MiniModal";
import NoDataFound from "../components/UI/NoDataFound";
import { BASE_URL } from "../Constants/constants";
const Profile = ({ socket,setIsUpdated }) => {
  const [userData, setUserData] = useState({});
  const { id } = useParams();
  const { fullName, userId } = useSelector((state) => state.userAuth);
  const [userExists, setUserExists] = useState(true);
  const [modalType, setModalType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSender, setIsSender] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState(
    friendshipStatuses.default
  );
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    setUserExists(true);
    // Fetch user data based on the userId
    setIsLoading(true);
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${id}`);
        if (!response.data) {
          setUserExists(false);
          setIsLoading(false);
          return;
        }

        setUserData(response.data);
        setIsLoading(false);
        setUserExists(true);

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
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, id, socket, fullName]);

  useEffect(() => {
    const fetchFriendshipStatus = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/friends/friendship-status`,
          {
            params: {
              ownerId: userId,
              profileUsername: id,
            },
          }
        );
        if (response.data) {
          const { friendshipStatus, isSenderOwner } = response.data;
          setFriendshipStatus(friendshipStatuses[friendshipStatus]);
          setIsSender(isSenderOwner);
          return;
        }
      } catch (error) {
        console.error("Error fetching friendship status", error);
      }
    };
    fetchFriendshipStatus();
  }, [userId, id]);

  const formatWithLineBreaks = (input) => {
    return input?.split("\n").map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };
  const withdrawRequest = async () => {
    const { status, toastMsg, toastType } = await withdrawFriendReq(userId, id);
    if (status !== "NA") {
      setFriendshipStatus(friendshipStatuses[status]);
    }
    if (toastType === "success") {
      toast.success(toastMsg);
    } else if (toastType === "error") {
      toast.error(toastMsg);
    }
  };
  const removeFriend = async() => {
    const { status, toastMsg, toastType } = await removeFriendship(userId, id);
    if (status !== "NA") {
      setFriendshipStatus(friendshipStatuses[status]);
    }
    if (toastType === "success") {
      toast.success(toastMsg);
    } else if (toastType === "error") {
      toast.error(toastMsg);
    }
    
  };
  const handleFriendStatusChange = async () => {
    const statuses = friendshipStatuses;
    switch (friendshipStatus) {
      case statuses.default:
      case statuses.rejected:
      case statuses.canceled: {
        const { status, toastMsg, toastType } = await sendRequest(userId, id);
        if (status !== "NA") {
          setFriendshipStatus(friendshipStatuses[status]);
        }
        if (toastType === "success") {
          toast.success(toastMsg);
        } else if (toastType === "error") {
          toast.error(toastMsg);
        }
        break;
      }
      case statuses.pending:
        setModalType("withdraw");
        setIsModal(true);
        break;
      case statuses.accepted:
        setModalType("remove");
        setIsModal(true);
        break;
      case statuses.blocked:
        toast.error("Sorry, you are blocked.");
        break;
      default:
        // Optional: Handle unexpected statuses
        console.warn("Unexpected friendship status:", friendshipStatus);
    }
  };
  const closeModal = () => {
    setIsModal(false);
  };
  const logout = async () => {
    await axios.post(`${BASE_URL}/logout`);
    window.location.href = "/";
  };
  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div className="sm:w-[600px] w-full max-w-full sm:border-r border-r-none sm:border-line h-full overflow-y-auto overflow-x-hidden sm:border-l">
          <div className="w-full px-4  sticky top-0 bg-white h-16 flex justify-center items-start flex-col z-20">
            {isLoading ? (
              <CustomSkeleton className="text-2xl font-bold text-dark1 leading-7 min-w-48" />
            ) : (
              <h1 className="text-2xl font-bold text-dark1 leading-7 min-w-48">
                {userData?.fullName || "Profile"}
              </h1>
            )}
            {isLoading ? (
              <CustomSkeleton className="text-mainText leading-4  text-sm  overflow-hidden text-ellipsis whitespace-nowrap min-w-72" />
            ) : (
              <p
                className={`text-mainText leading-4  text-sm  overflow-hidden text-ellipsis whitespace-nowrap min-w-72`}
              >
                {userData?.status}
              </p>
            )}
          </div>
          <div className="h-[200px] w-full bg-slate-200 relative z-10">
            {isLoading ? (
              <CustomSkeleton className="w-full h-full absolute top-0 left-0 z-20 bg-slate-200" />
            ) : (
              userData?.banner && (
                <img
                  className="w-full h-full absolute top-0 left-0 z-20"
                  alt="Banner"
                  src={userData?.banner}
                />
              )
            )}
            <div className="absolute bottom-[-72px] left-5 w-36 h-36  border-white border-4 rounded-full bg-slate-300 z-30">
              {isLoading ? (
                <CustomSkeleton
                  className={
                    "w-full h-full absolute top-0 left-0 z-20 rounded-full"
                  }
                />
              ) : (
                userData?.imgUrl && (
                  <img
                    className="w-full h-full absolute top-0 left-0 z-20 rounded-full"
                    alt="Profile"
                    src={userData?.imgUrl}
                  />
                )
              )}
            </div>
          </div>
          {userExists && (
            <div className="flex justify-end items-start h-20">
              {isLoading ? (
                <CustomSkeleton
                  className={"mt-2 mr-2 rounded-full w-[108px] h-[38px]"}
                />
              ) : userId === userData?.userId ? (
                <button
                  className="mt-2 mr-2 rounded-full border border-borderColor font-semibold px-4 py-1.5 hover:bg-line"
                  onClick={() => {
                    setModalType("edit");
                  }}
                >
                  Edit Profile
                </button>
              ) : isSender ? (
                <button
                  className="mt-2 mr-2 rounded-full border border-borderColor font-semibold px-4 py-1.5 hover:bg-line"
                  onClick={handleFriendStatusChange}
                >
                  {friendshipStatus}
                </button>
              ) : (
                <button
                  className="mt-2 mr-2 rounded-full border border-borderColor font-semibold px-4 py-1.5 hover:bg-line"
                  onClick={async () => {
                    const { status, toastMsg, toastType } =
                      await acceptFriendship(userId, id);
                    if (status !== "NA") {
                      setFriendshipStatus(friendshipStatuses[status]);
                    }
                    setIsSender(true);
                    if (toastType === "success") {
                      toast.success(toastMsg);
                    } else if (toastType === "error") {
                      toast.error(toastMsg);
                    }
                  }}
                >
                  Accept Request
                </button>
              )}
            </div>
          )}

          {userExists ? (
            <>
            <div className="px-3 pb-4 border-b border-line">
              <div className="mb-2 min-w-48">
                {isLoading ? (
                  <CustomSkeleton className="text-2xl font-bold text-dark1 leading-6 w-48" />
                ) : (
                  <h2 className="text-2xl font-bold text-dark1 leading-6 ">
                    {userData?.fullName}
                  </h2>
                )}
                {isLoading ? (
                  <CustomSkeleton className={"w-24"} />
                ) : (
                  <p className="text-mainText">@{userData?.username}</p>
                )}
              </div>
              <div className="mb-2 ">
                {isLoading ? (
                  <>
                    <CustomSkeleton className={"w-full"} />{" "}
                    <CustomSkeleton className={"w-[60%]"} />
                    <CustomSkeleton className={"w-[80%]"} />
                  </>
                ) : (
                  <p className="text-mainText">
                    {formatWithLineBreaks(userData?.about || "")}
                  </p>
                )}
              </div>
              <div className="mb-2">
                {isLoading ? (
                  <CustomSkeleton
                    className={
                      "text-mainText flex justify-start items-center gap-2 w-36"
                    }
                  />
                ) : (
                  <p className="text-mainText flex justify-start items-center gap-2">
                    <IoCalendarOutline />
                    <b>Joined</b>
                    {userData?.dateJoined
                      ? new Date(userData.dateJoined).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : ""}
                  </p>
                )}
              </div>
            </div>
            {userId === userData?.userId  && <div onClick={()=>{
              setModalType("logout");
              setIsModal(true);
            }} className="w-full py-4 flex justify-center items-center hover:bg-transRed hover:text-red cursor-pointer">
            Log Out
          </div>}
            
          </>
          ) : (
            <>
              {!isLoading && (
                <div className="mt-20">
                  <NoDataFound
                    title={"This account doesn't exist"}
                    desc={"Try searching for another"}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden sm:px-3 px-0 lg:block hidden">
          <TopUsers />
        </div>
        {modalType === "edit" && (
          <EditProfileModal setModalType={setModalType} user={userData} setIsUpdated={setIsUpdated} />
        )}
      </div>
      {modalType === "withdraw" && isModal && (
        <MiniModal
          closeModal={closeModal}
          actionBtnText="Withdraw Request"
          actionBtnFun={withdrawRequest}
          title="Confirm Withdrawal"
          desc="Withdrawing this request will stop its processing. You can resubmit it later, but any previous progress may be lost."
        />
      )}
      {modalType === "logout" && isModal && (
        <MiniModal
          closeModal={closeModal}
          actionBtnText="Log Out"
          actionBtnFun={logout}
          title="Confirm Logout"
          desc="You’re logging out of your account. We’ll be here whenever you’re ready to log back in. Looking forward to having you back soon!"
        />
      )} 
      {modalType === "remove" && isModal && (
        <MiniModal
          closeModal={closeModal}
          actionBtnText="Remove Friend"
          actionBtnFun={removeFriend}
          title={`Remove Friend @${id}`}
          desc="Are you sure you want to remove this friend? This action will delete them from your friend list."
        />
      )}
    </>
  );
};

export default Profile;
