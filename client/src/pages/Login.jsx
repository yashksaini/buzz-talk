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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length < 6) {
      toast.info("Username requires a minimum of 6 characters.", {
        autoClose: 1000,
      });
      return;
    }
    if (password.length < 6) {
      toast.info("Password must be a minimum of 6 characters", {
        autoClose: 1000,
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
          toast.success("Logging In", {
            autoClose: 1000,
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          toast.error("Username or Password is incorrect", {
            autoClose: 1000,
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
          <img src={"./logo1.png"} alt="Logo" className="h-8 " />
          <span className=" text-primary text-xl font-bold leading-[32px]">
            TALK
          </span>
        </div>
        <div className="w-full my-8">
          <h1 className="text-3xl font-bold text-mainText mb-2">Log In</h1>
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
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className={sharedStyles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className={sharedStyles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
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
