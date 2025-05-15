import { useEffect } from "react";
import { axiosInstance } from "../config/api";
import useAuth from "./useAuth";
import useRefreshAccessToken from "./useRefreshAccessToken";

const useApi = () => {
  const { refreshAccessToken } = useRefreshAccessToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refreshAccessToken();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refreshAccessToken]);

  return axiosInstance;
};

export default useApi;
