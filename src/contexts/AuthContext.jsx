import { createContext, useContext, useState } from "react";
import { login as authLogin, logout as authLogout, getSession } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());

  const login = (username, password) => {
    const session = authLogin(username, password);
    setUser(session);
    return session;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const isAdmin = user?.roles?.includes("administrator");

  return (
    <AuthContext.Provider value={{ user, loading: false, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
