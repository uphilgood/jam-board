"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Type definitions for the user and context
interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the token and user from cookies
    const storedToken = Cookies.get("token");
    const storedUser = Cookies.get("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser({ ...JSON.parse(storedUser) }); // Assuming user info is stored as JSON
    } else {
      router.push("/login");
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    // Store token and user in cookies (optionally mark them as HttpOnly via the API)
    Cookies.set("token", newToken, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("user", JSON.stringify(newUser), {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    // Remove token and user from cookies
    Cookies.remove("token");
    Cookies.remove("user");

    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
