import TopUsers from "../components/TopUsers";

const Notifications = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-[600px] border-r border-line h-full overflow-y-auto overflow-x-hidden">
        <div className="w-full px-4  sticky top-0 bg-white h-16 flex justify-center items-start flex-col z-10 ">
          <h1 className="text-2xl font-bold text-dark1 leading-7">
            Notifications
          </h1>
        </div>
        <div></div>
      </div>
      <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden px-3">
        <TopUsers />
      </div>
    </div>
  );
};

export default Notifications;
