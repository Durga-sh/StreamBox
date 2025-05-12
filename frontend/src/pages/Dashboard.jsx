import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {user && (
          <div>
            <h2 className="text-xl mb-2">Welcome, {user.fullName}!</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>

            {user.avatar && (
              <div className="mt-4">
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}

            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
