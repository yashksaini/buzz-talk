import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { BASE_URL } from "../main";
import logo from "../assets/logo1.png";
import { MdOutlineDashboard, MdDashboard } from "react-icons/md";
import { FaRegUser, FaUser } from "react-icons/fa6";
import { IoChatbubblesOutline, IoChatbubbles } from "react-icons/io5";
import { HiOutlineUsers, HiMiniUsers } from "react-icons/hi2";
import { BsBell, BsBellFill } from "react-icons/bs";
const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { fullName, userId } = useSelector((state) => state.userAuth);
  const adminNavs = [
    {
      text: "Dashboard",
      link: "/",
      icon: <MdOutlineDashboard />,
      activeIcon: <MdDashboard />,
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
    <nav className=" h-full p-2">
      <div className="w-full flex flex-1 gap-1 justify-start items-center px-3 py-4">
        <img src={logo} alt="Logo" className="h-12" />
        <span className=" text-primary text-2xl font-bold leading-10">
          TALK
        </span>
      </div>
      <div className="mt-4">
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
                <span>{nav.activeIcon}</span>
                <span>{nav.icon}</span>
                <span>{nav.text}</span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminNav;
