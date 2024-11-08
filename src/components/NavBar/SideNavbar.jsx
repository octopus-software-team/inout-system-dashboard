import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import img from "../../assests/11.jpg";
import {
  FaChartPie,
  FaPlus,
  FaEye,
  FaHome,
  FaTools,
  FaHardHat,
  FaTimes,
  FaBars,
  FaUser,
  FaUserTie,
  FaComments,
  FaTasks,
  FaCheck,
  FaClipboardList,
  FaUserPlus,
  FaBriefcase,
  FaUserEdit,
} from "react-icons/fa";
import { path } from "d3";

const projects = [
  {
    name: "Add New Project",
    path: "/allprojects/addnewproject",
    icon: <FaPlus className="mr-2" />,
  },
  {
    name: "Show All Projects",
    path: "/allprojects/showallprojects",
    icon: <FaEye className="mr-2 text-gray-400" />,
  },
];

const company = [
  {
    name: "Add Branch",
    path: "/company/addbranch",
    icon: <FaHome className="mr-2 text-gray-400" />,
  },
  {
    name: "Add Engineer",
    path: "/company/addengineer",
    icon: <FaTools className="mr-2 text-gray-400" />,
  },
  {
    name: "Add Services",
    path: "/company/addservices",
    icon: <FaHardHat className="mr-2 text-gray-400" />,
  },
];

const customers = [
  {
    name: "clients",
    path: "/customers/clients",
    icon: <FaUser className="mr-2 text-gray-400" />,
  },
  {
    name: "owner",
    path: "/customers/owner",
    icon: <FaUserTie className="mr-2 text-gray-400" />,
  },
  {
    name: "consaltative",
    path: "/customers/consaltative",
    icon: <FaComments className="mr-2 text-gray-400" />,
  },
];

const todo = [
  {
    name: "add new task",
    path: "/todo/addnewtask",
    icon: <FaCheck className="mr-2 text-gray-400" />,
  },
  {
    name: "show all task",
    path: "/todo/showalltask",
    icon: <FaEye className="mr-2 text-gray-400" />,
  },
];

const admin = [
  {
    name: "addnewrole",
    path: "/admin/addnewrole",
    icon: <FaBriefcase className="mr-2 text-gray-400" />,
  },
  {
    name: "editroles",
    path: "/admin/editroles",
    icon: <FaUserEdit className="mr-2 text-gray-400" />,
  },
];

const NavItemWithSubMenu = ({ title, icon, items, isOpen, onToggle }) => {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      >
        <svg
          className={`w-3 h-3 mr-2 transition-transform duration-300 text-gray-400 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
        <span className="flex items-center">
          {icon}
          <span className="flex-1 ml-3 text-left">{title}</span>
        </span>
      </button>
      <ul
        className={`pl-8 mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {items.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className="flex items-center text-sm text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md"
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null); // لإدارة العنصر المفتوح

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleToggleItem = (item) => {
    setActiveItem((prevItem) => (prevItem === item ? null : item));
  };

  return (
    <div>
      <nav className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 shadow-md fixed w-full z-30 top-0">
        <div className="flex items-center space-x-3">
          <button className="md:hidden text-gray-500" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <Link to="/dashboard">
            <h1 className="text-gray-400 ml-24 text-3xl font-bold cursor-pointer">
              INOUT
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
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
      </nav>

      {sidebarOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-800 z-20 p-4 shadow-md md:hidden">
          <ul className="font-medium">
            <li className="text-gray-400 text-sm mb-4">Main Menu</li>

            <NavItemWithSubMenu
              title="Projects"
              icon={<FaChartPie className="text-transparent w-5 h-5 opacity-0" />}
              items={projects}
              isOpen={activeItem === "Projects"}
              onToggle={() => handleToggleItem("Projects")}
            />

            <NavItemWithSubMenu
              title="Company"
              icon={<FaHome className="text-gray-400 w-5 h-5 opacity-0 text-transparent" />}
              items={company}
              isOpen={activeItem === "Company"}
              onToggle={() => handleToggleItem("Company")}
            />

            <NavItemWithSubMenu
              title="customers"
              icon={<FaUser className="text-gray-400 w-5 h-5 opacity-0 text-transparent" />}
              items={customers}
              isOpen={activeItem === "customers"}
              onToggle={() => handleToggleItem("customers")}
            />

            <NavItemWithSubMenu
              title="todo"
              icon={<FaHome className="text-gray-400 w-5 h-5 opacity-0 text-transparent" />}
              items={todo}
              isOpen={activeItem === "todo"}
              onToggle={() => handleToggleItem("todo")}
            />

            <NavItemWithSubMenu
              title="admin"
              icon={<FaHome className="text-gray-400 w-5 h-5 opacity-0 text-transparent" />}
              items={admin}
              isOpen={activeItem === "admin"}
              onToggle={() => handleToggleItem("admin")}
            />
          </ul>
        </div>
      )}

      <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 h-full fixed top-0 left-0 z-10 pt-16">
        <div className="h-full p-4 space-y-2 overflow-y-auto">
          <ul className="font-medium ml-5">
            <li className="text-gray-400 mt-10  text-sm mb-4">Main Menu</li>

            <NavItemWithSubMenu
              title="Projects"
              icon={<FaChartPie className="text-gray-400 w-5 h-5" />}
              items={projects}
              isOpen={activeItem === "Projects"}
              onToggle={() => handleToggleItem("Projects")}
            />

            <NavItemWithSubMenu
              title="Company"
              icon={<FaHome className="text-gray-400 w-5 h-5" />}
              items={company}
              isOpen={activeItem === "Company"}
              onToggle={() => handleToggleItem("Company")}
            />

            <NavItemWithSubMenu
              title="customers"
              icon={<FaUser className="text-gray-400 w-5 h-5" />}
              items={customers}
              isOpen={activeItem === "customers"}
              onToggle={() => handleToggleItem("customers")}
            />

            <NavItemWithSubMenu
              title="todo"
              icon={<FaClipboardList className="text-gray-400 w-5 h-5" />}
              items={todo}
              isOpen={activeItem === "todo"}
              onToggle={() => handleToggleItem("todo")}
            />

            <NavItemWithSubMenu
              title="admin"
              icon={<FaUserPlus className="text-gray-400 w-5 h-5" />}
              items={admin}
              isOpen={activeItem === "admin"}
              onToggle={() => handleToggleItem("admin")}
            />
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;
