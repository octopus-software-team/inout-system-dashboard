import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    
    return false; 
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
   
    <button 
      onClick={() => setIsDarkMode(!isDarkMode)} 
      className="p-2 rounded-full  text-white"
    >
      {isDarkMode ? (
        <FaMoon className="text-2xl text-gray-400" />
      ) : (
        <FaSun className="text-xl text-yellow-300" />
      )}
    </button>
  );
}
