import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

/**
 * A route that redirects to the login page if the user is not authenticated.
 */
const PrivateRoute: React.FC = () => {
  const { auth } = useAuth();

  return !auth || !auth.accessToken ? (
    <Navigate to="/login" replace />
  ) : (
    <Outlet />
  );
};

export default PrivateRoute;
