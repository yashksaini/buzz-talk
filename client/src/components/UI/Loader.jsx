import { Oval } from "react-loader-spinner";
const Loader = () => {
  return (
    <Oval
      visible={true}
      height="40"
      width="40"
      color="#7a9df2"
      secondaryColor="#B4CAFF"
      strokeWidth={4}
    />
  );
};

export default Loader;
