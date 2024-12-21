import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom"; 
import ProfileImage from "../../assests/11.jpg"; 
import Logout from "../logout/Logout";
import DarkModeToggle from "../../theme/DarkMode";

export default function DropDown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); 

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex gap-3 items-center justify-between">
      <DarkModeToggle />
      <div className="relative" ref={dropdownRef}>
        <img
          src={ProfileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={toggleDropdown}
        />

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
            <div className="flex items-center gap-3 mb-4">
              <img src={ProfileImage} alt="Profile" className="w-12 h-12 rounded-full" />
            </div>

            <ul className="space-y-2 text-gray-700">
              <li>
                <Link
                  to="/dropdown/admindetails" // تحديد مسار الصفحة المستهدفة
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                  onClick={() => setDropdownOpen(false)} // إغلاق القائمة بعد النقر
                >
                  <i className="fas fa-user"></i> Profile
                </Link>
              </li>
            </ul>

            {/* خيارات إضافية */}
            <div className="border-t border-gray-200 my-3"></div>

            <Logout />
          </div>
        )}
      </div>
    </div>
  );
}
