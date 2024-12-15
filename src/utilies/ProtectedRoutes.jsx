import { Navigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';

export const IsAuthenticated = ({ element: Component }) => {
  const isLoggedIn = Cookies.get('token');
  const location = useLocation();

  return isLoggedIn ? (
    <Navigate to="/home" state={{ from: location }} replace />
  ) : (
    Component
  );
};

export const PrivateRoute = ({ element: Component }) => {
  const isLoggedIn = Cookies.get('token');
  const location = useLocation();

  return isLoggedIn ? Component : <Navigate to="/" />;
};
