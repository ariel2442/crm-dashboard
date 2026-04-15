/**
 * AuthContext — holds the logged-in user and exposes login/logout.
 */
import { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  validateToken,
  fetchCurrentUser,
  clearToken,
  getToken,
} from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      const ok = await validateToken();
      if (ok) {
        try {
          const me = await fetchCurrentUser();
          setUser(me);
        } catch {
          clearToken();
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (username, password) => {
    await apiLogin(username, password);
    const me = await fetchCurrentUser();
    setUser(me);
    return me;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const isAdmin = user?.roles?.includes("administrator");
  const isClient = user?.roles?.includes("client");

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isClient }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
