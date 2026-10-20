
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { userApi } from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const resp = await userApi.get("/getCurrent/user");

      const data =
        resp.data?.user ??
        resp.data?.User ??
        resp.data?.data ??
        null;

      const currentUser = Array.isArray(data) ? data[0] : data;

      setUser(currentUser || null);

      return currentUser || null;
    } catch (err) {
      console.error(
        "Fetch user error:",
        err.response?.data || err.message
      );

      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await userApi.post("/logout/user", {});
    } catch (err) {
      console.error(
        "Logout error:",
        err.response?.data || err.message
      );
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, fetchUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
