import { Outlet, useNavigate } from "react-router";
import useApi from "../hooks/useApi";
import useAuth from "../hooks/useAuth";

const TopBar: React.FC = () => {
  const { auth } = useAuth();
  const api = useApi();
  const navigate = useNavigate();

  const logout = async () => {
    await api
      .post("/auth/logout")
      .catch((error) => {
        alert("Logout failed: " + error.message);
      })
      .finally(() => {
        navigate("/login", { replace: true });
      });
  };

  return (
    <>
      <div className="w-full h-16 bg-[#15141c] text-white flex items-center justify-between px-4">
        <div className="text-lg font-bold">Weather App by Simon Lundberg</div>
        <div className="flex items-center">
          {auth?.accessToken ? (
            <>
              <button type="button" onClick={logout} className="hover:text-gray-400">
                Logout
              </button>
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
