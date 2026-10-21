
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
    setLoading(true);

    try {
      const response = await userApi.get("/getCurrent/user");
      const data =
        response.data?.user ??
        response.data?.User ??
        response.data?.data ??
        null;

      const currentUser = Array.isArray(data) ? data[0] : data;

      if (!currentUser?._id) {
        setUser(null);
        return null;
      }

      setUser(currentUser);
      return currentUser;
    } catch (error) {
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
    await userApi.post(
      "/logout/user",
      {},
      { withCredentials: true }
    );

    setUser(null);
    return true;
  } catch (error) {
    console.error(
      "Logout failed:",
      error.response?.data || error.message
    );
    throw error;
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
