import { createContext } from "react";

// Create the AuthContext
export const AuthContext = createContext({
  authState: {
    username: "",
    id: 0,
    status: false,
  },
  setAuthState: () => {},
});
