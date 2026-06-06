import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedUser = localStorage.getItem("user");

    if (savedToken) setToken(savedToken);
    if (savedRole) setRole(savedRole);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (userData, tokenData) => {
    setUser(userData);
    setRole(userData.role);
    setToken(tokenData);

    localStorage.setItem("token", tokenData);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        login,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);