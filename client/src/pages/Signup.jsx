/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../main";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeBanner from "../components/HomeBanner";
// import logo from "@assets/logo.png";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fullName.length < 4) {
      toast.info("Name must be at least 4 characters long.", {
        autoClose: 1000,
      });
      return;
    }
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
          toast.success("Signed Up successfully. Please Login.", {
            autoClose: 1000,
          });
          setTimeout(() => {
            navigate("/");
          }, 900);
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(`${error?.response?.data?.message}`, {
            autoClose: 1000,
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
          <img src={"./logo1.png"} alt="Logo" className="h-10 " />
          <span className="text-gray-700 text-xl font-bold tracking-tighter mt-[4px]">
            TALK
          </span>
        </div>
        <div className="w-full my-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Sign Up</h1>
          <p className="text-sm text-gray-500">
            Create a new account to get started
          </p>

          <form onSubmit={handleSubmit} autoComplete="off" className="mt-12">
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block mb-[2px] text-black tracking-[-0.02em] font-medium"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full border rounded-md px-4 h-10 bg-white border-gray-300 text-[15px] font-medium text-black tracking-wider placeholder:font-light focus:outline-none focus:border-primary focus:border-2 md:h-12"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block mb-[2px] text-black tracking-[-0.02em] font-medium"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full border rounded-md px-4 h-10 bg-white border-gray-300 text-[15px] font-medium text-black tracking-wider placeholder:font-light focus:outline-none focus:border-primary focus:border-2 md:h-12"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-[2px] text-black tracking-[-0.02em] font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full border rounded-md px-4 h-10 bg-white border-gray-300 text-[15px] font-medium text-black tracking-wider placeholder:font-light focus:outline-none focus:border-primary focus:border-2 md:h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white rounded-md h-12 hover:bg-primaryHover focus:outline-none font-semibold md:h-14"
            >
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
