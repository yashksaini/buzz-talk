// eslint-disable-next-line react/prop-types
const Switch = ({ isChecked,setIsChecked }) => {

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div className="flex items-center gap-4 text-lg sm:text-xl">
      <div
        className={`w-[34px] h-[22px] flex items-center rounded-full  cursor-pointer transition-colors duration-300 ${
          isChecked ? "bg-primary" : "bg-borderColor"
        }`}
        onClick={handleToggle}
      >
        <div
          className={`bg-white w-[18px] h-[18px] rounded-full shadow-md transform transition-transform duration-300 ${
            isChecked ? "translate-x-[14px]" : "translate-x-[2px]"
          }`}
        ></div>
      </div>
    </div>
  );
};
export default Switch;