/* eslint-disable react/prop-types */
// Signup.jsx
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../main";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fullName.length > 0 && username.length > 0 && password.length > 0) {
      try {
        const response = await axios.post(
          `${BASE_URL}/signup`,
          {
            fullName,
            username,
            password,
          },
          { withCredentials: true }
        );
        if (response.data === true) {
          navigate("/");
          alert("Signned Up Please Login");
          window.location.reload();
        } else {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl text-center mb-4 font-semibold text-blue-500">
          Signup for Buzz Talk
        </h2>
        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="mb-4">
            <label htmlFor="fullName" className="block mb-1 text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full border rounded-md px-3 py-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1 text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full border rounded-md px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe..."
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded-md px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="johndoe123..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-2"
          >
            Signup
          </button>
        </form>
        <Link
          to={"/"}
          className="text-center text-gray-500 text-xs mt-4 w-full block"
        >
          Already have account. Login
        </Link>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <p className="text-red-600 text-lg mb-6">
              Signup failed. Please try again. Username already exists.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                setPassword("");
                setUsername("");
                setFullName("");
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
