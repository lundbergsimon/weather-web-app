import { createContext, useState } from "react";

type AuthContextType = {
  auth: { accessToken: string };
  setAuth: (auth: { accessToken: string }) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * A React Context Provider that provides a state variable and
 * an updating function for the user's access token.
 *
 * The `auth` state variable is an object with a single `accessToken`
 * property, which is a string representing the user's access token.
 *
 * The `setAuth` function takes an object with an `accessToken` property
 * and updates the `auth` state variable with that value.
 *
 * The `AuthProvider` component wraps the `children` component(s) and
 * provides the `auth` and `setAuth` values to them via React Context.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<{ accessToken: string }>({
    accessToken: ""
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
