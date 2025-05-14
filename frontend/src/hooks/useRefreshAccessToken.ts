import { api } from "../config/api";
import useAuth from "./useAuth";

const useRefreshAccessToken = () => {
  const { setAuth } = useAuth();

  const refreshAccessToken = async () => {
    const response = await api.get("/auth/refresh", {
      withCredentials: true,
    });

    setAuth({
      accessToken: response.data.accessToken,
    });

    return response.data.accessToken;
  };

  return { refreshAccessToken };
};

export default useRefreshAccessToken;
