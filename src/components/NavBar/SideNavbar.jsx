import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import img from "../../assests/11.jpg";
import { FaChartPie, FaPlus, FaEye, FaHome, FaTools, FaHardHat, FaTimes, FaBars } from "react-icons/fa";

const projects = [
  { name: "Add New Project", path: "/allprojects/addnewproject", icon: <FaPlus className="mr-2 text-gray-400" /> },
  { name: "Show All Projects", path: "/allprojects/showallprojects", icon: <FaEye className="mr-2 text-gray-400" /> },
];

const company = [
  { name: "Add Branch", path: "/company/addbranch", icon: <FaHome className="mr-2 text-gray-400" /> },
  { name: "Add Engineer", path: "/company/addengineer", icon: <FaTools className="mr-2 text-gray-400" /> },
  { name: "Add Services", path: "/company/addservices", icon: <FaHardHat className="mr-2 text-gray-400" /> },
];

const NavItemWithSubMenu = ({ title, icon, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li>
      <button
        type="button"
        onClick={toggleSubMenu}
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      >
        {icon}
        <span className="flex-1 ml-3 text-left">{title}</span>
        <svg className={`w-3 h-3 ml-2 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
      {isOpen && (
        <ul className="pl-8 mt-2 space-y-1 overflow-hidden">
          {items.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className="flex items-center text-sm text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md">
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      {/* Navbar علوي */}
      <nav className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 shadow-md fixed w-full z-30 top-0">
        {/* زر القائمة العلوي على اليسار */}
        <div className="flex items-center space-x-3">
          <button className="md:hidden text-gray-500" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-gray-400 text-2xl font-bold">INOUT</h1>
        </div>

        {/* عناصر النافبار على اليمين */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon
              icon={isDarkMode ? faSun : faMoon}
              className={isDarkMode ? "text-yellow-500" : "text-gray-800 dark:text-white"}
            />
          </button>
          <img src={img} alt="Profile" className="h-10 w-10 rounded-full" />
        </div>
      </nav>

      {/* الشريط الجانبي كقائمة منسدلة عند فتح القائمة على الشاشات الصغيرة */}
      {sidebarOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-800 z-20 p-4 shadow-md md:hidden">
          <ul className="font-medium">
            <li className="text-gray-400 text-sm mb-4">Main Menu</li>

            <NavItemWithSubMenu title="Projects" icon={<FaChartPie className="text-gray-400 w-5 h-5" />} items={projects} />
            <NavItemWithSubMenu title="Company" icon={<FaHome className="text-gray-400 w-5 h-5" />} items={company} />
            <li className="text-gray-400 mt-4">Profile</li>
          </ul>
        </div>
      )}

      {/* الشريط الجانبي العادي للشاشات الكبيرة */}
      <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 h-full fixed top-0 left-0 z-10 pt-16">
        <div className="h-full p-4 space-y-2 overflow-y-auto">
          <ul className="font-medium">
            <li className="text-gray-400 text-sm mb-4">Main Menu</li>

            <NavItemWithSubMenu title="Projects" icon={<FaChartPie className="text-gray-400 w-5 h-5" />} items={projects} />
            <NavItemWithSubMenu title="Company" icon={<FaHome className="text-gray-400 w-5 h-5" />} items={company} />
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;
