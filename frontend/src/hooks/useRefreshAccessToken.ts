import { axiosPublic } from "../config/api";
import useAuth from "./useAuth";

const useRefreshAccessToken = () => {
  const { setAuth } = useAuth();

  const refreshAccessToken = async () => {
    const response = await axiosPublic.post("/auth/refresh", {
      withCredentials: true,
    });

    setAuth({
      accessToken: response.data["access_token"],
    });

    return response.data.accessToken;
  };

  return { refreshAccessToken };
};

export default useRefreshAccessToken;
