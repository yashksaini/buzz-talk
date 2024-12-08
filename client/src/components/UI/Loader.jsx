import { Oval } from "react-loader-spinner";
const Loader = () => {
  return (
    <Oval
      visible={true}
      height="40"
      width="40"
      color="#1D9BF0"
      secondaryColor="#1D9BF0"
      strokeWidth={4}
    />
  );
};

export default Loader;
