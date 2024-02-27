import { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { useSelector } from "react-redux";
import { BASE_URL } from "../main";
import axios from "axios";
import ProfileIcon from "./ProfileIcon";
const TopUsers = () => {
  const { userId } = useSelector((state) => state.userAuth);
  const [recentUsers, setRecentUsers] = useState([]);
  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/recent-users`, {
          userId,
        });
        console.log(response.data);
        setRecentUsers(response.data);
      } catch (error) {
        console.error("Error fetching recent users:", error);
      }
    };
    fetchRecentUsers();
  }, [userId]);
  return (
    <div className="w-full px-4">
      <div className="w-full sticky top-0 left-0 z-10 py-2 bg-white">
        <div className="w-full h-12 bg-backgroundDark rounded-full border border-backgroundDark flex justify-center items-center gap-3 px-3 focus-within:bg-white focus-within:border-primaryBorder ">
          <GoSearch className="text-2xl group:focus-within text-primary " />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent focus:outline-none text-dark1 font-medium"
          />
        </div>
      </div>

      <div className="my-2 w-full bg-backgroundDark rounded-3xl  py-4 min-h-80">
        <h1 className="text-2xl text-dark1 font-bold px-4 mb-2">New Members</h1>
        {recentUsers.map((user, index) => (
          <div
            key={index}
            className="w-full py-3 px-6 flex justify-start items-center gap-2 hover:bg-line cursor-pointer"
          >
            <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
              {!user?.imgUrl && <ProfileIcon fullName={user?.fullName} />}
              {user?.imgUrl && (
                <img
                  src={user?.imgUrl}
                  alt="profile"
                  className="w-9 h-9 rounded-full"
                />
              )}
            </div>
            <div className="w-[calc(100%_-_52px)] h-10 flex justify-center items-start flex-col gap-[2px]">
              <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-bold ">
                {user?.fullName}
              </p>
              <p className="leading-4  text-mainText text-xs">
                @{user?.username}
              </p>
            </div>
            <a
              href={"/profile/" + user?._id}
              className="px-5 py-1 bg-dark2 text-white rounded-full "
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUsers;
