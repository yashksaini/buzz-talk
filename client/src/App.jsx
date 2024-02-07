/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeAuthentication } from "./redux/userAuthentication";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./user/Dashboard";
import Profile from "./user/Profile";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import { BASE_URL } from "./main";

function App({ socket }) {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.userAuth);

  axios.defaults.withCredentials = true;
  const getAuth = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth`);
      dispatch(changeAuthentication(response.data));
      if (response.data) {
        socket.emit("login", response.data);
      } else {
        socket.emit("logout", socket.id);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAuth();
    socket.on("profileVisit", ({ visitedUserId, visitorName }) => {
      console.log(visitedUserId);
      toast.info(`${visitorName} visited your profile.`);
    });
  }, []);

  return (
    <>
      {isAuth && <Navbar />}
      <Routes>
        {/* For Unauthenticated Users */}
        {!isAuth && (
          <>
            <Route element={<Login />} path="/" />
            <Route element={<Signup />} path="/signup" />
          </>
        )}

        {/* If user is admin */}
        {isAuth && (
          <>
            <Route element={<Dashboard socket={socket} />} path="/" />
            <Route element={<Profile socket={socket} />} path="/profile/:id" />
            <Route element={<Navigate to="/" />} path="*" />
          </>
        )}
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={3}
        className="text-sm toastContainer"
        closeButton={false}
      />
    </>
  );
}

export default App;
