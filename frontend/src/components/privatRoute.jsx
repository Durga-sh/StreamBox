import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/auth.service";

const PrivateRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("accessToken");
    return !!token; // Convert to boolean
  };

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default PrivateRoute;
