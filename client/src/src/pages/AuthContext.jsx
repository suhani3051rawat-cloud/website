import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
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
                resp.data?.user ||
                resp.data?.User ||
                resp.data?.data ||
                null;

            const current = Array.isArray(data) ? data[0] : data;

            setUser(current || null);
        } catch (err) {
            console.log(
                "Fetch user error:",
                err.response?.data || err.message
            );

            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const logout = async () => {
        try {
            await userApi.post("/logout/user", {});
        } catch (err) {
            console.log(
                "Logout error:",
                err.response?.data || err.message
            );
        }

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, fetchUser, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
