import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

/**
 * A hook that returns the auth context, which includes the user's access
 * token and a function to set it. The hook throws an error if it's not
 * used within a AuthProvider.
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export default useAuth;