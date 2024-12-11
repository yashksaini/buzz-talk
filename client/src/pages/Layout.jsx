import Navbar from "../components/Navbar";

// eslint-disable-next-line react/prop-types
const Layout = ({ isUpdated, children }) => {
  return (
    <div className="container">
      <div className="navbar">
        <Navbar isUpdated={isUpdated} />
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
