import axios from "axios";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { BASE_URL } from "../main";
import { FaRegUser, FaUser } from "react-icons/fa6";
import { IoChatbubblesOutline, IoChatbubbles } from "react-icons/io5";
import { HiOutlineUsers, HiMiniUsers } from "react-icons/hi2";
import { BsBell, BsBellFill } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import ProfileIcon from "./ProfileIcon";
import { Tooltip as ReactTooltip } from "react-tooltip";
const Navbar = () => {
  const { fullName, userId, username, imgUrl } = useSelector(
    (state) => state.userAuth
  );
  const adminNavs = [
    {
      text: "Home",
      link: "/",
      icon: <GoHome />,
      activeIcon: <GoHomeFill />,
    },
    {
      text: "Profile",
      link: `/profile/${userId}`,
      icon: <FaRegUser />,
      activeIcon: <FaUser />,
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

  const logout = async () => {
    await axios.post(`${BASE_URL}/logout`);
    window.location.href = "/";
  };

  return (
    <nav className=" h-full p-2 flex flex-col px-3 overflow-y-auto overflow-x-hidden">
      <div className="w-full flex gap-1 justify-start items-center px-3 mb-4 mt-2 ml-2 hover:cursor-pointer text-2xl font-black">
        BUZZ <span className="text-primary">TALK</span>
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
              <div className="inline-flex group-hover:bg-backgroundDark transition duration-300 ease-in-out justify-center items-center gap-3 px-5 h-12 rounded-full">
                <span className="h-12 flex justify-center items-center pb-[2px]">
                  {nav.activeIcon}
                </span>
                <span className="h-12 flex justify-center items-center pb-[2px]">
                  {nav.icon}
                </span>
                <span className="leading-[48px]">{nav.text}</span>
              </div>
            </NavLink>
          );
        })}
      </div>

      <div
        className="mt-auto w-full rounded-full  min-h-16 basis-0 flex mb-2  justify-center items-center px-2 gap-2 hover:bg-backgroundDark cursor-pointer"
        data-tooltip-id="logout-tip"
        onClick={logout}
      >
        <div className="w-10 h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
          {imgUrl && (
            <img src={imgUrl} alt="profile" className="w-9 h-9 rounded-full" />
          )}
          {!imgUrl && <ProfileIcon fullName={fullName} />}
        </div>
        <div className="w-[calc(100%_-_52px)] h-10 flex justify-center items-start flex-col gap-[2px]">
          <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-bold">
            {fullName}
          </p>
          <p className="leading-4  text-mainText">@{username}</p>
        </div>
      </div>
      <ReactTooltip id="logout-tip" place="top" content="Log Out" />
    </nav>
  );
};

export default Navbar;
