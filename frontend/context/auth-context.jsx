"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function refetchUser() {
        try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
                credentials: "include",
            });
            if (!res.ok) {
                setUser(null);
                return;
            }
            const data = await res.json();
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refetchUser();
    }, []);

    async function logout() {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, refetchUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
