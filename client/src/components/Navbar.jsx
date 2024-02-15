import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { BASE_URL } from "../main";
import logo from "../assets/logo1.png";
import { FaRegUser, FaUser } from "react-icons/fa6";
import { IoChatbubblesOutline, IoChatbubbles } from "react-icons/io5";
import { HiOutlineUsers, HiMiniUsers } from "react-icons/hi2";
import { BsBell, BsBellFill } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { fullName, userId } = useSelector((state) => state.userAuth);
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
      <div className="w-full flex gap-1 justify-start items-center px-3">
        <img src={logo} alt="Logo" className="h-6" />
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
        className="mt-auto w-full rounded-full bg-gray-100 min-h-16 basis-0 flex mb-2 border justify-center items-center"
        onClick={logout}
      >
        Logout
      </div>
    </nav>
  );
};

export default AdminNav;
