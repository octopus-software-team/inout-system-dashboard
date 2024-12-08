import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
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
    <button onClick={() => setIsDarkMode(!isDarkMode)} className="">
      {isDarkMode ? (
        <FaMoon className="mr-2 text-2xl text-gray-400" />
      ) : (
        <div className="flex items-center justify-center  w-10 h-10 rounded-full">
          <FaSun className="text-xl text-yellow-300" />
        </div>
      )}
    </button>
  );
}
