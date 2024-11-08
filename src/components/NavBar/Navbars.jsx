import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars } from "@fortawesome/free-solid-svg-icons"; // إضافة أيقونة faBars لزر القائمة
import img from "../../assests/11.jpg";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
   
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <button
          onClick={toggleSidebar} 
          className="md:hidden p-2 text-gray-500 focus:outline-none"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        <div className="flex items-center">
          {/* <h1 className="text-gray-400 text-3xl ml-3 md:ml-16 cursor-pointer">
            INOUT
          </h1> */}
          <Link
            to="/dashboard"
            className="inout text-xl font-bold text-gray-800 hover:text-blue-600 cursor-pointer"
          >
            INOUT
          </Link>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon
              icon={isDarkMode ? faSun : faMoon}
              className={
                isDarkMode ? "text-yellow-500" : "text-gray-800 dark:text-white"
              }
            />
          </button>

          <img src={img} alt="Profile" className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
