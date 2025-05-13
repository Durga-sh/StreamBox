import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import VideoList from "../components/video/VideoList";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-md mx-auto">
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

        {/* Video Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Videos</h2>
            <Link
              to="/upload-video"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Upload Video
            </Link>
          </div>
          <VideoList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
