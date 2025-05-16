import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const PrivateRoute: React.FC = () => {
  const { auth } = useAuth();

  return !auth || !auth.accessToken ? <Navigate to="/login" replace /> : <Outlet />;
};

export default PrivateRoute;
