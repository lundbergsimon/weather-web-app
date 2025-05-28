import { useEffect } from "react";
import { axiosPrivate } from "../config/api";
import useAuth from "./useAuth";
import useRefreshAccessToken from "./useRefreshAccessToken";

/**
 * A hook that wraps `axiosPrivate` and adds two interceptors:
 *   1. Adds the current access token to the Authorization header of each request.
 *   2. If a request is rejected with a 403 status code, refreshes the access token and
 *      retries the request with the new token.
 *
 * This hook is useful for making requests to protected API endpoints that require
 * an access token.
 */
const useApiPrivate = () => {
  const { refreshAccessToken } = useRefreshAccessToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refreshAccessToken();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refreshAccessToken]);

  return { apiPrivate: axiosPrivate };
};

export default useApiPrivate;
