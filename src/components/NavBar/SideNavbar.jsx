import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartPie,
  FaPlus,
  FaEye,
  FaHome,
  FaHardHat,
  FaUser,
  FaUserTie,
  FaComments,
  FaCheck,
  FaClipboardList,
  FaBriefcase,
  FaUserEdit,
  FaUserPlus,
  FaTimes,
  FaBars,
  FaSearch,
  FaFileAlt,
  FaCubes,
} from "react-icons/fa";
import logo22 from "../../assests/logoo22.png";
import DropDown from "../Login/DropDown";
// import Cookies from 'js-cookie';

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
    name: "Branchs",
    path: "/company/Branchs",
    icon: <FaHome className="mr-2 text-gray-400" />,
  },
  {
    name: "Services",
    path: "/company/Services",
    icon: <FaHardHat className="mr-2 text-gray-400" />,
  },

  {
    name: "Employees",
    path: "/company/employees",
    icon: <FaUserTie className="mr-2 text-gray-400" />,
  },

  {
    name: "Assets",
    isSubmenu: true,
    items: [
      {
        name: "Add New Assets",
        path: "/company/assets/addnewassets",
        icon: <FaFileAlt className="mr-2 text-gray-400" />,
      },
      {
        name: "Add Materials",
        path: "/company/assets/addmaterials",
        icon: <FaCubes className="mr-2 text-gray-400" />,
      },

      {
        name: "Material Category",
        path: "/company/assets/materialcategory",
        icon: <FaCubes className="mr-2 text-gray-400" />,
      },
      {
        name: "assets type",
        path: "/company/assets/assetstype",
        icon: <FaCubes className="mr-2 text-gray-400" />,
      },
      {
        name: "project Report",
        path: "/company/projectsecrepo",
        icon: <FaCubes className="mr-2 text-gray-400" />,
      },
    ],
  },
];

const customers = [
  {
    name: "Clients",
    path: "/customers/clients",
    icon: <FaUser className="mr-2 text-gray-400" />,
  },
  {
    name: "Owner",
    path: "/customers/owner",
    icon: <FaUserTie className="mr-2 text-gray-400" />,
  },
  {
    name: "Consaltative",
    path: "/customers/consaltative",
    icon: <FaComments className="mr-2 text-gray-400" />,
  },
];

const todo = [
  {
    name: "Add New Task",
    path: "/todo/addnewtask",
    icon: <FaCheck className="mr-2 text-gray-400" />,
  },
  {
    name: "Show All Task",
    path: "/todo/showalltask",
    icon: <FaEye className="mr-2 text-gray-400" />,
  },
];

const admin = [
  {
    name: "Add New Role",
    path: "/admin/addnewrole",
    icon: <FaBriefcase className="mr-2 text-gray-400" />,
  },
  {
    name: "Edit Roles",
    path: "/admin/editroles",
    icon: <FaUserEdit className="mr-2 text-gray-400" />,
  },
];

const moderator = [
  {
    name: "moderator",
    path: "/moderation/moderator",
    icon: <FaUserEdit className="mr-2 text-gray-400" />,
  },
];

const NavItemWithSubMenu = ({ title, icon, items, isOpen, onToggle }) => (
  <span>
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center w-full p-2 text-bas text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
    >
      <svg
        className={`w-3 h-3 mr-2 transition-transform duration-300 text-gray-400 ${
          isOpen ? "rotate-0" : "[transform:rotate(270deg)]"
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
        {icon &&
          React.cloneElement(icon, {
            className: "w-5 bg-transparent h-5 text-gray-500",
          })}
        <span className="flex-1 ml-3 text-[#6e7891] text-left">{title}</span>
      </span>
    </button>
    <ul
      className={`pl-8 mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      {items.map((item, index) => (
        <li key={index}>
          {item.isSubmenu ? (
            <NavItemWithSubMenu
              title={item.name}
              icon={item.icon}
              items={item.items}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          ) : (
            <Link
              to={item.path}
              className="flex items-center text-sm text-gray-400 hover:bg-gray-100 p-2 rounded-md"
            >
              {item.icon}
              <span className="ml-5 text-[#525b75]">{item.name}</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  </span>
);

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItems, setActiveItems] = useState({});
  const [subMenuItems, setSubMenuItems] = useState({});

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleToggleItem = (item) => {
    setActiveItems({
      [item]: !activeItems[item],
    });
  };

  const handleToggleSubMenuItem = (submenu) => {
    setSubMenuItems((prevItems) => ({
      ...prevItems,
      [submenu]: !prevItems[submenu],
    }));
  };

  return (
    <div className="dark:bg-slate-900 bg-white transition-colors duration-300">
      <nav className="nav-item flex items-center justify-between dark:bg-slate-900 h-20 p-4  border-b dark:border-gray-50 fixed w-full z-30 top-0 transition-colors duration-300 ">
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-gray-500" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <Link className="flex items-center h-16" to="/dashboard">
            <img className="w-16 min-h-3" src={logo22} alt="Logo" />
            <h1 className="text-gray-500  dark:text-white text-3xl font-semibold cursor-pointer">
              INOUT
            </h1>
          </Link>
        </div>
        <form className="w-4/12 mx-auto hidden sm:block">
          <label
            htmlFor="default-search"
            className="text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="search"
              id="default-search"
              className="block ml-2 h-10 w-full pl-10 text-sm text-gray-900 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              required
            />
          </div>
        </form>

        <div className="flex items-center space-x-4">
          <DropDown />
        </div>
      </nav>

      <aside className="line hidden  border-b-2 md:block w-80 dark:text-white h-full fixed top-0 left-0 z-10 pt-16">
        <div className="side h-full p-4 space-y-2 dark:text-white overflow-y-auto">
          <ul className="font-medium ml-5">
            <li className="text-gray-400 mt-10 text-sm mb-4">Main Menu</li>

            {/* قائمة Projects */}
            <NavItemWithSubMenu
              title="Projects"
              icon={<FaChartPie className="text-gray-400 w-5 h-5" />}
              items={projects}
              isOpen={activeItems["Projects"]}
              onToggle={() => handleToggleItem("Projects")}
            />

            {/* قائمة Company */}
            <NavItemWithSubMenu
              title="Company"
              icon={<FaHome className="text-gray-400 w-5 h-5" />}
              items={company.map((item) => ({
                ...item,
                isOpen:
                  item.name === "Assets" ? subMenuItems["Assets"] : undefined,
                onToggle:
                  item.name === "Assets"
                    ? () => handleToggleSubMenuItem("Assets")
                    : undefined,
              }))}
              isOpen={activeItems["Company"]}
              onToggle={() => handleToggleItem("Company")}
            />

            {/* قائمة Customers */}
            <NavItemWithSubMenu
              title="Customers"
              icon={<FaUser className="text-gray-400 w-5 h-5" />}
              items={customers}
              isOpen={activeItems["Customers"]}
              onToggle={() => handleToggleItem("Customers")}
            />

            {/* قائمة To Do */}
            <NavItemWithSubMenu
              title="To Do"
              icon={<FaClipboardList className="text-gray-400 w-5 h-5" />}
              items={todo}
              isOpen={activeItems["ToDo"]}
              onToggle={() => handleToggleItem("ToDo")}
            />

            {/* قائمة Admin */}
            <NavItemWithSubMenu
              title="Admin"
              icon={<FaUserPlus className="text-gray-400 w-5 h-5" />}
              items={admin}
              isOpen={activeItems["Admin"]}
              onToggle={() => handleToggleItem("Admin")}
            />

            <NavItemWithSubMenu
              title="moderator"
              icon={<FaUserPlus className="text-gray-400 w-5 h-5" />}
              items={moderator}
              isOpen={activeItems["moderator"]}
              onToggle={() => handleToggleItem("moderator")}
            />
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;
