import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

import {
  FaChartPie,
  FaPlus,
  FaEye,
  FaHome,
  FaTools,
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
} from "react-icons/fa";
import DropDown from "../Login/DropDown";

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
        icon: <FaHome className="mr-2 text-gray-400" />,
      },
      {
        name: "Add Materials",
        path: "/company/assets/addmaterials",
        icon: <FaHome className="mr-2 text-gray-400" />,
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
    name: "Consultative",
    path: "/customers/consultative",
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

const NavItemWithSubMenu = ({ title, icon, items, isOpen, onToggle }) => (
  <li>
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center w-full p-2 text-bas text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
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
        <span className="flex-1 ml-3 text-gray-400 text-left">{title}</span>
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
              isOpen={isOpen} // Use individual isOpen state for each submenu
              onToggle={onToggle}
            />
          ) : (
            <Link
              to={item.path}
              className="flex items-center text-sm text-gray-400 hover:bg-gray-100 p-2 rounded-md"
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  </li>
);

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItems, setActiveItems] = useState({});

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleToggleItem = (item) => {
    setActiveItems((prevItems) => ({
      ...prevItems,
      [item]: !prevItems[item],
    }));
  };

  return (
    <div className="dark:bg-slate-900 bg-white transition-colors duration-300">
      <nav className="flex items-center justify-between dark:bg-slate-900 p-4 border-b-2 fixed w-full z-30 top-0 transition-colors duration-300 ">
        <div className="flex items-center space-x-">
          <button className="md:hidden text-gray-500" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <Link className="dark:bg-slate-900" to="/dashboard">
            <h1 className="text-gray-400 ml-24 text-3xl font-bold cursor-pointer">
              INOUT
            </h1>
          </Link>
        </div>

        <div>
          <input type="text" placeholder="Search" />
        </div>
        <div className="flex items-center space-x-4">
          <DropDown />
        </div>
      </nav>

      {sidebarOpen && (
        <div className="absolute top-16 left-0 w-full z-20 p-4 shadow-md md:hidden">
          <ul className="font-medium">
            <li className="text-gray-400 text-sm mb-4 font-extralight">
              Main Menu
            </li>

            <NavItemWithSubMenu
              title="Projects"
              icon={<FaChartPie className="text-gray-400 w-5 h-5" />}
              items={projects}
              isOpen={activeItems["Projects"]}
              onToggle={() => handleToggleItem("Projects")}
            />

            <NavItemWithSubMenu
              title="Company"
              icon={<FaHome className="text-gray-400 w-5 h-5" />}
              items={company}
              isOpen={activeItems["Company"]}
              onToggle={() => handleToggleItem("Company")}
            />

            <NavItemWithSubMenu
              title="Customers"
              icon={<FaUser className="text-gray-400 w-5 h-5" />}
              items={customers}
              isOpen={activeItems["Customers"]}
              onToggle={() => handleToggleItem("Customers")}
            />

            <NavItemWithSubMenu
              title="To Do"
              icon={<FaClipboardList className="text-gray-400 w-5 h-5" />}
              items={todo}
              isOpen={activeItems["ToDo"]}
              onToggle={() => handleToggleItem("ToDo")}
            />

            <NavItemWithSubMenu
              title="Admin"
              icon={<FaUserPlus className="text-gray-400 w-5 h-5" />}
              items={admin}
              isOpen={activeItems["Admin"]}
              onToggle={() => handleToggleItem("Admin")}
            />
          </ul>
        </div>
      )}

      <aside className="hidden md:block w-80 dark:text-white bg-white h-full fixed top-0 left-0 z-10 pt-16">
        <div className="h-full p-4 space-y-2 dark:bg-slate-900 dark:text-white overflow-y-auto">
          <ul className="font-medium ml-5">
            <li className="text-gray-400 mt-10 text-sm mb-4">Main Menu</li>

            <NavItemWithSubMenu
              title="Projects"
              icon={<FaChartPie className="text-gray-400 w-5 h-5" />}
              items={projects}
              isOpen={activeItems["Projects"]}
              onToggle={() => handleToggleItem("Projects")}
            />

            <NavItemWithSubMenu
              title="Company"
              icon={<FaHome className="text-gray-400 w-5 h-5" />}
              items={company}
              isOpen={activeItems["Company"]}
              onToggle={() => handleToggleItem("Company")}
            />

            <NavItemWithSubMenu
              title="Customers"
              icon={<FaUser className="text-gray-400 w-5 h-5" />}
              items={customers}
              isOpen={activeItems["Customers"]}
              onToggle={() => handleToggleItem("Customers")}
            />

            <NavItemWithSubMenu
              title="To Do"
              icon={<FaClipboardList className="text-gray-400 w-5 h-5" />}
              items={todo}
              isOpen={activeItems["ToDo"]}
              onToggle={() => handleToggleItem("ToDo")}
            />

            <NavItemWithSubMenu
              title="Admin"
              icon={<FaUserPlus className="text-gray-400 w-5 h-5" />}
              items={admin}
              isOpen={activeItems["Admin"]}
              onToggle={() => handleToggleItem("Admin")}
            />
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;