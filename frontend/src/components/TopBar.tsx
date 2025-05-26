import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const TopBar: React.FC = () => {
  const { auth } = useAuth();

  return (
    <>
      <div className="w-screen h-16 bg-gray-800 text-white flex items-center justify-between px-4">
        <div className="text-lg font-bold">My Application</div>
        <div className="flex items-center space-x-4">
          {auth?.accessToken ? (
            <>
              <p>Logged in as: User</p>
              <a href="/logout" className="hover:text-gray-400">
                Logout
              </a>
            </>
          ) : (
            <>
              <a href="/login" className="hover:text-gray-400">
                Login
              </a>
              <a href="/register" className="hover:text-gray-400">
                Register
              </a>
            </>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default TopBar;
