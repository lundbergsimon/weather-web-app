import { Outlet, useNavigate } from "react-router";
import useApi from "../hooks/useApi";
import useAuth from "../hooks/useAuth";

const TopBar: React.FC = () => {
  const { auth } = useAuth();
  const { apiPrivate } = useApiPrivate();
  const navigate = useNavigate();

  const logout = async () => {
    await apiPrivate
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
        <div className="text-lg font-bold text-gray-200">
          <span>Simple Weather App</span>
          <span className="text-gray-400 font-normal"> by </span>
          <span>Simon Lundberg</span>
        </div>
        <div className="flex items-center">
          {auth?.accessToken && (
            <button
              type="button"
              onClick={logout}
              className="hover:text-gray-400"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default TopBar;
