import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import useRefreshAccessToken from "../hooks/useRefreshAccessToken";

const PersistLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { refreshAccessToken } = useRefreshAccessToken();
  const { auth } = useAuth();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;


    const verifyRefreshToken = async () => {
      try {
        await refreshAccessToken();
        setIsLoading(false);
      } catch (error) {
        console.error("Error refreshing access token:", error);
        setIsLoading(false);
      }
    };

    if (!auth?.accessToken) {
      verifyRefreshToken()
    } else {
      setIsLoading(false);
    }

    return () => {
      console.log("PersistLogin: Cleaning up effect.");
      isMounted.current = true;
    };
  }, [auth, refreshAccessToken]);

  return <>{isLoading ? <div>Loading...</div> : <Outlet />}</>;
};

export default PersistLogin;
