import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import useRefreshAccessToken from "../hooks/useRefreshAccessToken";


const PersistLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { refreshAccessToken } = useRefreshAccessToken();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const accessToken = await refreshAccessToken();
        console.log("Access token refreshed:", accessToken);

        setAuth({ accessToken });
      } catch (error) {
        console.error("Failed to refresh access token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!auth?.accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  return <>{isLoading ? <div>Loading...</div> : <Outlet />}</>;
};

export default PersistLogin;
