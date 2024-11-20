import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const isLoggedIn = localStorage.getItem("token"); // Check if the user is logged in
  return isLoggedIn ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
