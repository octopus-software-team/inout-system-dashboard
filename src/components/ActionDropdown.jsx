// ActionDropdown.js
import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaEye, FaTrash, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ActionDropdown = ({ projectId, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleViewClick = () => {
    navigate(`/allprojects/addreport/${projectId}`);
    setIsOpen(false);
  };

  const handleEditClick = () => {
    navigate(`/allprojects/updateprojects/${projectId}`);
    setIsOpen(false);
  };

  const handleDeleteClick = () => {
    onDelete(projectId);
    setIsOpen(false);
  };

  return (
    <div className=" relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="icon inline-flex justify-center w-full p-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <FaEllipsisV />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={handleEditClick}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center"
            >
              <FaEdit className="mr-2" /> Edit
            </button>
            <button
              onClick={handleViewClick}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center"
            >
              <FaEye className="mr-2" /> View
            </button>
            <button
              onClick={handleDeleteClick}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
