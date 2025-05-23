import { axiosPublic } from "../config/api";

const useRefreshAccessToken = () => {
  const refreshAccessToken = async () => {
    const response = await axiosPublic.post("/auth/refresh", {
      withCredentials: true,
    });

    return response.data["access_token"];
  };

  return { refreshAccessToken };
};

export default useRefreshAccessToken;
