import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = Cookies.get('token');
    console.log(token);

    console.log(token)

    if (!token) {
      console.log("No token found, cannot log out.");
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/logout",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        try {
          const data = await response.json();
          console.log("Logout failed:", data);
        } catch {
          console.log("Logout failed with non-JSON response.");
        }
        return;
        // const data = await response.json();
        // console.error("Logout failed", data);
      }

      localStorage.removeItem("token");
      
      
      navigate("/");
      
    } catch (error) {
      console.log("An error occurred during logout", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
