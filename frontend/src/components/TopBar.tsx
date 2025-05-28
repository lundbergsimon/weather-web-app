import { Outlet, useNavigate } from "react-router";
import useApiPrivate from "../hooks/useApiPrivate";
import useAuth from "../hooks/useAuth";
import usePopUp from "../hooks/usePopUp";

/**
 * A top bar component that renders a navigation bar with a logout
 * button when the user is logged in. The component also renders the
 * `Outlet` component from React Router, which renders the current route's
 * component.
 */
const TopBar: React.FC = () => {
  const { auth } = useAuth();
  const { apiPrivate } = useApiPrivate();
  const navigate = useNavigate();
  const { displayPopUp } = usePopUp();

  const logout = async () => {
    await apiPrivate
      .post("/auth/logout")
      .catch(() => {
        displayPopUp("Logged out failed!", "error");
      })
      .finally(() => {
        navigate("/login", { replace: true });
        displayPopUp("Logged out successfully", "success");
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
