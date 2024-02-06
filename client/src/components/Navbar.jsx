import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { BASE_URL } from "../main";

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { fullName, userId } = useSelector((state) => state.userAuth);
  const adminNavs = [
    { text: "Dashboard", link: "/" },
    { text: "Profile", link: `/profile/${userId}` },
  ];

  const logout = async () => {
    await axios.post(`${BASE_URL}/logout`);
    window.location.href = "/";
  };

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800">
      {/* Changed the background color */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-xl ">{fullName}</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1 text-gray-300">
              {adminNavs.map((data) => (
                <NavLink
                  caseSensitive
                  to={data.link}
                  key={data.link}
                  activeclassname=""
                  className={({ isActive }) =>
                    isActive
                      ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm "
                      : "hover:text-white px-3 py-2 rounded-md text-sm  text-gray-300"
                  }
                  end
                >
                  {data.text}
                </NavLink>
              ))}
              <button onClick={logout}>LogOut</button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleNav}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-gray-300">
          {adminNavs.map((data) => (
            <NavLink
              onClick={toggleNav}
              caseSensitive
              to={data.link}
              key={data.link}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base text-gray-300 "
                  : "hover:text-white block px-3 py-2 rounded-md text-base text-gray-300"
              }
              end
            >
              {data.text}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
