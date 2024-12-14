import { Navigate, useLocation } from "react-router-dom";

export const IsAuthenticated = ({ element: Component }) => {
  const isLoggedIn = localStorage.getItem("token");
  const location = useLocation();

  return isLoggedIn ? (
    <Navigate to="/home" state={{ from: location }} replace />
  ) : (
    Component
  );
};

export const PrivateRoute = ({ element: Component }) => {
  const isLoggedIn = localStorage.getItem("token");
  const location = useLocation();

  return isLoggedIn ? Component : <Navigate to="/" />;
};
