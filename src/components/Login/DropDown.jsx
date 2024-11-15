import React, { useState } from "react";
import ProfileImage from "../../assests/11.jpg"; // Replace with your profile image path
import { Link } from "react-router-dom";

export default function DropDown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSignOut = () => {
    // Add your sign-out logic here if needed
    setDropdownOpen(false); // Close the dropdown
  };

  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <img
          src={ProfileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={toggleDropdown}
        />

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
            {/* Profile Section */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={ProfileImage}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              {/* <div>
                <h2 className="font-semibold">Jassa Rich</h2>
                <input
                  type="text"
                  placeholder="Update your status"
                  className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div> */}
            </div>

            {/* Menu Options */}
            <ul className="space-y-2 text-gray-700">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                >
                  <i className="fas fa-user"></i> Profile
                </a>
              </li>
              
              
             
             
            </ul>

            {/* Additional Options */}
            <div className="border-t border-gray-200 my-3"></div>
            <a
              href="#"
              className="block text-gray-700 text-sm p-2 hover:bg-gray-100 rounded text-center"
            >
              Add another account
            </a>

            {/* Sign Out Button */}
            <Link to="/loginn">  
            
            <button
              // onClick={handleSignOut}
              className="w-full mt-2 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center gap-2 font-medium"
            >
              <i className="fas fa-sign-out-alt"></i> Sign out
            </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}