import { BiInfoCircle, BiSend } from "react-icons/bi";

const ChatArea = () => {
  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      <div className="sticky top-0 left-0 h-14 bg-white flex justify-between items-center px-3 border-b border-line">
        <h1 className="text-dark1 font-bold">User Full Name</h1>
        <span className="aspect-square h-8 hover:bg-gray-100 cursor-pointer flex justify-center items-center rounded-full">
          <BiInfoCircle />
        </span>
      </div>
      <div className="w-full min-h-[calc(100dvh_-_112px)]  overflow-x-hidden overflow-y-auto"></div>
      <div className="flex justify-start items-center sticky bottom-0 w-full h-14 bg-white border-t border-line px-3 py-2">
        <div className="bg-gray-100 w-full h-full rounded-xl flex justify-center items-center">
          <input
            type="text"
            className="bg-transparent flex-1 focus:outline-none px-4"
            placeholder="Start a new message"
          />
          <button className="px-4 h-full text-gray-600">
            <BiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
