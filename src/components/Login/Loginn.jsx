import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import logo4 from "../../assests/logo4.png";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Loginn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // localStorage.setItem("token", data.data.token);
        // change secure into true before the deploy
        Cookies.set('token', data.data.token, { expires: 7, secure: false})

        setIsLoginSuccessful(true);
        setError(null);
        navigate("/home");
      } else {
        if (data.data && data.data.email) {
          setError(data.data.email.join(", "));
        }
        else if (response.status === 400 && data.msg === "failed to login") {
          setError("Failed to login. Please check your password.");
        } else {
          setError(data.msg || "Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      setError("An error occurred, please try again later.");
    }
  };

  useEffect(() => {
    if (isLoginSuccessful) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; 
    };
  }, [isLoginSuccessful]);

  return (
    <div className="flex justify-center items-center h-min mr-64 bg-gray-100 dark:bg-slate-950">
      <div className="service w-full max-w-md rounded-lg shadow-lg p-8 space-y-6">
        <img className="w-24 mx-auto" src={logo4} alt="Logo" />
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Sign In
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-gray-600 font-semibold">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </span>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 text-black dark:bg-slate-900 dark:text-white  rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2 mt-4">
            <label htmlFor="password" className="text-gray-600 font-semibold">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full border dark:bg-slate-900 dark:text-white  border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
      </div>

      {isLoginSuccessful && (
        <div className="fixed inset-x-0 top-1 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center space-y-4 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-green-600">
              Login Successful!
            </h3>
            <p className="text-gray-600">Redirecting to the homepage...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Loginn;
