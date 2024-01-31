const HomeBanner = () => {
  return (
    <div
      className="flex-1 w-full  p-8 lg:flex justify-center items-center flex-col  hidden"
      style={{ background: "linear-gradient(to bottom, #a5fdc1, #ffd494)" }}
    >
      <img src="./logo.png" alt="Logo" className="w-80 h-80 " />
    </div>
  );
};

export default HomeBanner;
