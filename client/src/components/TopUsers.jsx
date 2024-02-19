import { GoSearch } from "react-icons/go";
const TopUsers = () => {
  return (
    <div className="w-full ">
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

      <div className="my-2 w-full bg-backgroundDark rounded-3xl p-4 min-h-80"></div>
      <div className="my-2 w-full bg-backgroundDark rounded-3xl p-4 min-h-40"></div>
    </div>
  );
};

export default TopUsers;
