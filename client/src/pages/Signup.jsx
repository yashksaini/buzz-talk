/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../main";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeBanner from "../components/HomeBanner";
import { sharedStyles } from "../sharedStyles/utils";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import logo from "../assets/logo1.png";
const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fullName.trim().length < 4) {
      toast.info("Name: Minimum 4 characters", {
        autoClose: 1000,
        toastId: "name-info",
        hideProgressBar: true,
      });
      return;
    }
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

    if (fullName.length > 0 && username.length > 0 && password.length > 0) {
      try {
        const response = await axios.post(
          `${BASE_URL}/signup`,
          {
            fullName,
            username,
            password,
          },
          { withCredentials: true, credentials: "include" }
        );
        console.log(response);
        if (response.data === true) {
          toast.success("Sign up successful. Please log in", {
            autoClose: 1000,
            toastId: "signup-success",
            hideProgressBar: true,
          });
          setTimeout(() => {
            navigate("/");
          }, 900);
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(`${error?.response?.data?.message}`, {
            autoClose: 1000,
            toastId: "signup-error",
            hideProgressBar: true,
          });
        }
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="w-full bg-background min-h-screen  flex justify-center">
      <HomeBanner />
      <div className="max-w-full w-[420px] lg:w-[520px] p-8">
        <div className="w-full flex flex-1 gap-1 justify-start items-center">
          <img src={logo} alt="Logo" className="h-6" />
        </div>
        <div className="w-full my-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Sign Up</h1>
          <p className="text-sm text-grayText">
            Create a new account to get started
          </p>

          <form onSubmit={handleSubmit} autoComplete="off" className="mt-12">
            <div className="mb-4">
              <label htmlFor="fullName" className={sharedStyles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className={sharedStyles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
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
                placeholder="Choose a username"
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
                  placeholder="Choose a password"
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
              Sign Up
            </button>
          </form>

          <Link to="/" className="text-gray-500 text-sm mt-4 block ">
            Already have an account?
            <span className="text-primary text-semibold"> Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
