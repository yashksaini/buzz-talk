import { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IoSettingsOutline } from "react-icons/io5";
// import { BASE_URL } from "../main";
// import axios from "axios";
// import { useSelector } from "react-redux";
import { LuMailPlus } from "react-icons/lu";
import { GoSearch } from "react-icons/go";
import NewChatModal from "../components/NewChatModal";
const MyChats = () => {
  // const { userId } = useSelector((state) => state.userAuth);
  const [search, setSearch] = useState("");
  const [isNewChatModal, setIsNewChatModal] = useState(false);
  // const handleSearch = () => {};

  return (
    <>
      <div className="flex justify-center items-center h-full">
        {/* Friends List */}
        <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden border-r border-line text-dark1">
          {/* Top Section */}
          <div className="px-3">
            <div className="w-full flex justify-between items-center py-2">
              <span className="text-2xl font-bold text-dark1 leading-7 min-w-48">
                Messages
              </span>
              <div className="flex-1 flex justify-end items-center ">
                <span
                  className="hover:bg-line p-2 rounded-full cursor-pointer text-xl"
                  data-tooltip-id="settings-tip"
                >
                  <IoSettingsOutline />
                </span>
                <span
                  className="hover:bg-line p-2 rounded-full cursor-pointer text-xl"
                  data-tooltip-id="new-message-tip"
                  onClick={() => {
                    setIsNewChatModal(true);
                  }}
                >
                  <LuMailPlus />
                </span>
              </div>

              <ReactTooltip
                id="settings-tip"
                place="bottom"
                content="Settings"
                delayShow={500}
                style={{
                  zIndex: "50",
                }}
              />
              <ReactTooltip
                id="new-message-tip"
                place="bottom"
                content="New Message"
                delayShow={500}
                style={{
                  zIndex: "50",
                }}
              />
            </div>
            <div className="w-full bg-white">
              <div className="w-full h-12 bg-white rounded-full border border-borderColor flex justify-center items-center gap-3 pl-3 pr-2 focus-within:bg-white focus-within:border-primaryBorder ">
                <GoSearch className="text-2xl group:focus-within text-grayText " />
                <input
                  type="text"
                  placeholder="Search Direct Messages..."
                  className="flex-1 bg-transparent focus:outline-none text-dark1 font-medium"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                {/* <button
                  onClick={handleSearch}
                  className="bg-dark2 text-white h-8 px-4 rounded-full"
                >
                  Search
                </button> */}
              </div>
            </div>
          </div>
          {/* Chats List */}
          <div className="mt-4"></div>
        </div>
        {/* Chat Area */}
        <div className="w-[600px] border-r border-line h-full overflow-y-auto overflow-x-hidden">
          Chat Area
        </div>
      </div>
      {isNewChatModal && <NewChatModal setIsNewChatModal={setIsNewChatModal} />}
    </>
  );
};

export default MyChats;
