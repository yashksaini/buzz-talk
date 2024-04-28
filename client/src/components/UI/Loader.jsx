import { Oval } from "react-loader-spinner";
const Loader = () => {
  return (
    <Oval
      visible={true}
      height="40"
      width="40"
      color="#165DDD"
      secondaryColor="#165DDD"
      strokeWidth={4}
    />
  );
};

export default Loader;
