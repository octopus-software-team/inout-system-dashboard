import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import logo4 from "../../assests/logo4.png"
import { Link } from "react-router-dom";

function Loginn() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-6">
         <img className="w-20 ml-36" src={logo4} alt="" />
        <h2 className="text-center text-2xl font-bold text-gray-800">Sign In</h2>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-gray-600 font-semibold mb-1">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaUser className="text-gray-400" />
            </span>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="name@example.com"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <label htmlFor="password" className="text-gray-600 font-semibold mb-1">
            PASSWORD
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-400" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
            </span>
          </div>
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-gray-600">
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
        
        </div>

        {/* Sign In Button */}
       <Link to ="/">
       
       <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Sign In
          
        </button>
       </Link>

        {/* Create Account Link */}
       
      </div>
    </div>
  );
}

export default Loginn;



{/* <Link to="/">loginn</Link> */}