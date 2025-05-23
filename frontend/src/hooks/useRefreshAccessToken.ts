import { axiosPublic } from "../config/api";
import useAuth from "./useAuth";

const useRefreshAccessToken = () => {
  const { setAuth } = useAuth();

  const refreshAccessToken = async () => {
    const response = await axiosPublic.post("/auth/refresh");
    const accessToken = response.data["access_token"];
    setAuth({ accessToken });
    return accessToken;
  };

  return { refreshAccessToken };
};

export default useRefreshAccessToken;
