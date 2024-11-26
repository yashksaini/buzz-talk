import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { IoChatbubblesOutline, IoChatbubbles } from "react-icons/io5";
import { HiOutlineUsers, HiMiniUsers, HiOutlineUser, HiUser } from "react-icons/hi2";
import { BsBell, BsBellFill } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import ProfileIcon from "./ProfileIcon";
import axios from "axios"; // Use this axios otherwise logout will not work properly
import { useEffect, useState } from "react";
import { BASE_URL } from "../Constants/constants";
// eslint-disable-next-line react/prop-types
const Navbar = ({isUpdated}) => {
  const {  username,userId } = useSelector((state) => state.userAuth);
  const [unReadCount, setUnReadCount] = useState(0);
  const [userData,setUserData] = useState({});
  const adminNavs = [
    {
      text: "Home",
      link: "/",
      icon: <GoHome />,
      activeIcon: <GoHomeFill />,
    },
    {
      text: "Profile",
      link: `/profile/${username}`,
      icon: <HiOutlineUser />,
      activeIcon: <HiUser />,
    },
    {
      text: "Messages",
      link: "/chats",
      icon: <IoChatbubblesOutline />,
      activeIcon: <IoChatbubbles />,
    },
    {
      text: "Friends",
      link: "/friends",
      icon: <HiOutlineUsers />,
      activeIcon: <HiMiniUsers />,
    },
    {
      text: "Notifications",
      link: "/notifications",
      icon: <BsBell />,
      activeIcon: <BsBellFill />,
    },
  ];

  
  
  useEffect(()=>{
    const getNotificationsCount = async()=>{
      try {
        const response = await axios.get(`${BASE_URL}/notifications/getUnreadNotificationsOfUser`,{
          params: {
            userId: userId,
          },
        });
        if (response?.data) {
          setUnReadCount(response?.data?.unReadCount);
        }
      } catch (error) {
        console.error("Error getting notifications count:", error);
      }
    }
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/userImage/${username}`);
        if (!response.data) {
          return;
        }

        setUserData(response.data);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
    getNotificationsCount();
  },[userId,isUpdated,username]);

  return (
    <>
    <nav className=" h-full p-2 hidden sm:flex flex-col px-3 overflow-y-auto overflow-x-hidden">
      <div className="w-full gap-1 justify-start items-center px-3 mb-4 mt-2 ml-2 hover:cursor-pointer text-2xl font-black xl:flex hidden">
        BUZZ <span className="text-primary">TALK</span>
      </div>
      <div className="w-full gap-1 justify-start items-end px-3 mb-4 mt-2  hover:cursor-pointer text-2xl font-black flex xl:hidden">
        <span>B</span><span className="text-primary">T</span>
      </div>
      <div className="w-full mt-4">
        {adminNavs.map((nav, index) => {
          return (
            <NavLink
              to={nav.link}
              key={index}
              className={({ isActive }) =>
                isActive
                  ? "group text-dark1 font-semibold text-md flex justify-start items-center gap-2 text-xl h-12 mb-4 activeNav"
                  : "group text-mainText text-md flex justify-start items-center gap-2 text-xl  h-12 mb-4 defaultNav"
              }
            >
              <div className="inline-flex group-hover:bg-backgroundDark transition duration-300 ease-in-out justify-center items-center gap-0 xl:gap-3 px-5 h-12 rounded-full relative">
                <span className="h-12 flex justify-center items-center pb-[2px]">
                  {nav.activeIcon}
                </span>
                <span className="h-12 flex justify-center items-center pb-[2px]">
                  {nav.icon}
                </span>
                <div className="leading-[48px]"><i className="not-italic hidden xl:inline">{nav.text}</i> {nav.text==="Notifications" && unReadCount>0 && <div className="w-6 h-6 flex justify-center items-center bg-primary text-white absolute top-[-6px] right-[-6px] rounded-full font-normal text-sm">{unReadCount}</div>}</div>
              </div>
            </NavLink>
          );
        })}
      </div>

      <div
        className="mt-auto w-full rounded-full  min-h-16 basis-0 flex mb-2  justify-center items-center px-2 gap-2 hover:bg-backgroundDark cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
          {userData?.imgUrl && (
            <img src={userData?.imgUrl} alt="profile" className="w-9 h-9 rounded-full" />
          )}
          {!userData?.imgUrl && <ProfileIcon fullName={userData?.fullName} />}
        </div>
        <div className="w-[calc(100%_-_52px)] h-10 justify-center items-start flex-col gap-[2px] xl:flex hidden">
          <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-bold">
            {userData?.fullName}
          </p>
          <p className="leading-4  text-mainText">@{username}</p>
        </div>
      </div>
    </nav>
    <nav className="h-full sm:hidden grid grid-cols-5 border-line border-2 rounded-3xl backdrop-blur-sm bg-white" >
      {adminNavs.map((nav, index) => {
        return (
          <NavLink
            to={nav.link}
            key={index}
            className={({ isActive }) =>
              isActive
                ? "group text-primary text-2xl relative h-full  flex justify-center items-center flex-col gap-1 activeNav"
                : "group text-mainText text-2xl relative h-full  flex justify-center items-center flex-col gap-1 defaultNav"
            }
          >
              <span className="flex justify-center items-center pb-[2px]">
                {nav.activeIcon}
              </span>
              <span className="flex justify-center items-center pb-[2px]">
                {nav.icon}
              </span>
              <div className="text-[10px] leading-[1]">{ nav.text}</div>
              {nav.text==="Notifications" && unReadCount>0 && <span className="w-4 h-4 flex justify-center items-center bg-primary text-white absolute top-[8px] right-[calc(50%_-_16px)] rounded-full font-normal text-[10px] border border-line">{unReadCount}</span>}
          </NavLink>
        );
      })}
  </nav>
  </>
  );
};

export default Navbar;
