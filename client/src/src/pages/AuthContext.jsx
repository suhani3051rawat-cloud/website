import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { userApi } from '../api/axios.js';

const API = "http://localhost:5000/user/Auth";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
        const resp = await userApi.get('/getCurrent/user');
            const data = resp.data?.user;
            const current = Array.isArray(data) ? data[0] : data;
            setUser(current || null);
        } catch (err) {
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
            await axios.post(`${API}/logout/user`, {}, { withCredentials: true });
        } catch (err) {
            console.log(err.message);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, fetchUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);