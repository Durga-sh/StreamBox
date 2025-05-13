import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

export const AuthContext = createContext({
  user: null,
  token: null, // Add token to context
  login: () => {},
  register: () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Add state for token
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check user authentication status on app load
    const checkAuthStatus = async () => {
      try {
        // Retrieve token from localStorage
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
          // Set token in state
          setToken(storedToken);
          // Fetch current user with token
          const userData = await authService.getCurrentUser(storedToken);
          setUser(userData.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
        localStorage.removeItem("accessToken");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user, accessToken } = response.data; // Expect accessToken in response
      localStorage.setItem("accessToken", accessToken); // Store token
      setToken(accessToken); // Set token in state
      setUser(user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("accessToken"); // Clear token
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token, // Provide token in context
        login,
        register,
        logout,
        isAuthenticated,
        isLoading,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
