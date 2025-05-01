import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuthenticated: false,
    token: null,
    role: null,
  });

  const login = (token, role) => {
    setAuthData({ isAuthenticated: true, token, role });
  };

  const logout = () => {
    setAuthData({ isAuthenticated: false, token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
