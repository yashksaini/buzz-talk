/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../main";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeBanner from "../components/HomeBanner";
import { sharedStyles } from "../sharedStyles/utils";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import logo from "../assets/logo1.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim().length < 6) {
      toast.info("Username: Minimum 6 characters", {
        autoClose: 1000,
        toastId: "username-info",
        hideProgressBar: true,
      });
      return;
    }
    if (password.trim().length < 6) {
      toast.info("Password: Minimum 6 characters", {
        autoClose: 1000,
        toastId: "password-info",
        hideProgressBar: true,
      });
      return;
    }
    if (username.length > 0 && password.length > 0) {
      try {
        const response = await axios.post(
          `${BASE_URL}/login`,
          {
            username,
            password,
          },
          { withCredentials: true, credentials: "include" }
        );
        if (response.data === true) {
          toast.success("Logging In...", {
            autoClose: 1000,
            toastId: "login-success",
            hideProgressBar: true,
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          toast.error("Invalid username or password", {
            autoClose: 1000,
            toastId: "login-error",
            hideProgressBar: true,
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="w-full bg-background min-h-screen flex justify-center">
      <HomeBanner />
      <div className="max-w-full w-[420px] lg:w-[520px] p-8">
        <div className="w-full flex flex-1 gap-1 justify-start items-center">
          <img src={logo} alt="Logo" className="h-6" />
        </div>
        <div className="w-full my-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Log In</h1>
          <p className="text-sm text-grayText">
            Enter your username and password to login
          </p>

          <form onSubmit={handleSubmit} autoComplete="off" className="mt-12">
            <div className="mb-4">
              <label htmlFor="username" className={sharedStyles.label}>
                Username
              </label>
              <input
                type="text"
                id="username"
                className={sharedStyles.input}
                value={username}
                onChange={(e) => {
                  const trimmedValue = e.target.value.trim();
                  // If no space enter by user only then update the value
                  if (!/\s/.test(trimmedValue)) {
                    setUsername(trimmedValue);
                  }
                }}
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className={sharedStyles.label}>
                Password
              </label>
              <div className="w-full h-full relative">
                <input
                  type={isVisible ? "text" : "password"}
                  id="password"
                  className={sharedStyles.input}
                  value={password}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.trim();
                    // If no space enter by user only then update the value
                    if (!/\s/.test(trimmedValue)) {
                      setPassword(trimmedValue);
                    }
                  }}
                  placeholder="Enter your password"
                />
                <span
                  className="top-[calc(50%_-_16px)] right-2 absolute w-8 h-8 rounded-full flex justify-center items-center bg-white hover:cursor-pointer text-grayText text-xl"
                  onClick={() => {
                    setIsVisible(!isVisible);
                  }}
                >
                  {isVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </div>
            <button type="submit" className={sharedStyles.btnFull}>
              Log In
            </button>
          </form>

          <Link to="/signup" className="text-gray-500 text-sm mt-4 block">
            Don't have an account?{" "}
            <span className="text-primary text-semibold">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
