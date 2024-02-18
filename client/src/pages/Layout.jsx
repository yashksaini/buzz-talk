import Navbar from "../components/Navbar";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <div className="container">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content ">{children}</div>
    </div>
  );
};

export default Layout;
