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
import Notifications from "./user/Notifications";
import MyChats from "./user/MyChats";
import Friends from "./user/Friends";
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
          <div className="bg-gray-500">
            <Route element={<Dashboard socket={socket} />} path="/" />
            <Route element={<MyChats socket={socket} />} path="/chats" />
            <Route element={<Friends socket={socket} />} path="/friends" />
            <Route
              element={<Notifications socket={socket} />}
              path="/notifications"
            />
            <Route element={<Profile socket={socket} />} path="/profile/:id" />
            <Route element={<Navigate to="/" />} path="*" />
          </div>
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
