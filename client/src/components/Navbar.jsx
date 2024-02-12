import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { BASE_URL } from "../main";
import logo from "../assets/logo1.png";
import { RxDashboard } from "react-icons/rx";
import { CiUser } from "react-icons/ci";
import { LuMessagesSquare } from "react-icons/lu";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoIosNotificationsOutline } from "react-icons/io";
const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { fullName, userId } = useSelector((state) => state.userAuth);
  const adminNavs = [
    { text: "Dashboard", link: "/", icon: <RxDashboard /> },
    { text: "Profile", link: `/profile/${userId}`, icon: <CiUser /> },
    { text: "Messages", link: "/chats", icon: <LuMessagesSquare /> },
    { text: "Friends", link: "/friends", icon: <LiaUserFriendsSolid /> },
    {
      text: "Notifications",
      link: "/notifications",
      icon: <IoIosNotificationsOutline />,
    },
  ];

  const logout = async () => {
    await axios.post(`${BASE_URL}/logout`);
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-100 h-full p-2">
      <div className="w-full flex flex-1 gap-1 justify-start items-center">
        <img src={logo} alt="Logo" className="h-10" />
        <span className=" text-primary text-xl font-bold leading-10">TALK</span>
      </div>
      <div className="mt-8">
        {adminNavs.map((nav, index) => {
          return (
            <NavLink
              to={nav.link}
              key={index}
              className={({ isActive }) =>
                isActive
                  ? "text-white text-md flex justify-start items-center gap-2 text-xl bg-dark2 h-12 mb-4 rounded-md border"
                  : "text-gray-700 text-md flex justify-start items-center gap-2 text-xl  h-12 bg-white  mb-4 rounded-md border"
              }
            >
              <div className="inline-flex">
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
