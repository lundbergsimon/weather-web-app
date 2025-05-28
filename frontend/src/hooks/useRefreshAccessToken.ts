import { axiosPublic } from "../config/api";
import useAuth from "./useAuth";

/**
 * A custom hook that provides a function to refresh the access token.
 *
 * This hook is useful for refreshing the access token by making a request
 * to the `/auth/refresh` endpoint. It updates the `AuthProvider`with the
 * new access token when the refresh is successful.
 */
const useRefreshAccessToken = () => {
  const { setAuth } = useAuth();

  const refreshAccessToken = async () => {
    const response = await axiosPublic.post("/auth/refresh");
    const accessToken = response.data["access_token"];
    setAuth({ accessToken });
  };

  return { refreshAccessToken };
};

export default useRefreshAccessToken;
