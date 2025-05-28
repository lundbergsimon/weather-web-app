import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import usePopUp from "../hooks/usePopUp";
import useRefreshAccessToken from "../hooks/useRefreshAccessToken";

/**
 * This component is used to persist the user's login state, by refreshing the
 * access token when the user refreshes the page.
 */
const PersistLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { refreshAccessToken } = useRefreshAccessToken();
  const { auth } = useAuth();
  const isMounted = useRef(false);
  const { displayPopUp } = usePopUp();

  useEffect(() => {
    if (isMounted.current) return;

    const verifyRefreshToken = async () => {
      try {
        await refreshAccessToken();
        setIsLoading(false);
      } catch (error) {
        console.error("Error refreshing access token:", error);
        displayPopUp("Error refreshing access token");
        setIsLoading(false);
      }
    };

    if (!auth?.accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted.current = true;
    };
  }, [auth, refreshAccessToken]);

  return <>{isLoading ? <div>Loading...</div> : <Outlet />}</>;
};

export default PersistLogin;
