"use client";

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import videoService from "../services/video.service";

const ChannelPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { username } = useParams(); // Get username from URL
  const [channelData, setChannelData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!isAuthenticated || !username) {
        console.error("Authentication or username missing", {
          isAuthenticated,
          username,
          user,
        });
        setError(
          "Please log in or provide a valid username to view channel details"
        );
        setLoading(false);
        return;
      }

      try {
        // Fetch channel profile
        console.log("Fetching channel for username:", username);
        console.log("Authenticated user:", user);
        const channelResponse = await axios.get(
          `http://localhost:5000/api/v1/users/c/${username}`,
          { withCredentials: true }
        );
        const channel = channelResponse.data.data;
        console.log("Channel response:", channelResponse.data);
        console.log("Channel userId:", channel._id);
        setChannelData(channel);

        // Fetch videos for the user
        console.log("Fetching videos for userId:", channel._id);
        const videoResponse = await videoService.getAllVideos({
          userId: channel._id,
          page: 1,
          limit: 20,
        });
        console.log("Video response:", videoResponse);
        const fetchedVideos = videoResponse?.docs || [];
        console.log("Fetched videos:", fetchedVideos);

        if (!videoResponse || !videoResponse.docs) {
          console.warn("Video response is malformed or empty:", videoResponse);
          setError(
            "Unable to fetch videos at this time. Please try again later."
          );
        } else if (fetchedVideos.length === 0) {
          console.warn("No videos found for userId:", channel._id);
          // Log the values of user and username for debugging
          console.log("user:", user);
          console.log("username from useParams:", username);
          // Defensive check to ensure user and username are defined
          const isChannelOwner =
            user && user.username && username && user.username === username;
          setError(
            isChannelOwner
              ? "You haven't uploaded any videos yet."
              : "This channel has no published videos."
          );
        }

        setVideos(fetchedVideos);

        // Calculate total views
        const views = fetchedVideos.reduce(
          (sum, video) => sum + (video.views || 0),
          0
        );
        setTotalViews(views);

        setLoading(false);
      } catch (err) {
        const errorMessage = err.message || "Unknown error";
        console.error("Error fetching data in Channnel.jsx:", {
          message: errorMessage,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url,
        });
        setError(`Failed to fetch channel or video data: ${errorMessage}`);
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [username, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>Loading channel data...</p>
      </div>
    );
  }

  if (error && !channelData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!channelData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>No channel data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Channel Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600 relative">
            {channelData.coverImage && (
              <img
                src={channelData.coverImage}
                alt="Channel cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 gap-4">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                <img
                  src={channelData.avatar}
                  alt="Channel avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 pt-2">
                <h1 className="text-3xl font-bold text-slate-900">
                  {channelData.fullName}
                </h1>
                <p className="text-slate-600">
                  @{channelData.username} • Joined{" "}
                  {new Date(channelData.createdAt).getFullYear()}
                </p>
                <p className="mt-2 text-slate-700">
                  {channelData.description ||
                    "Share your videos with the world."}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  to="/channel/edit"
                  className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                >
                  Edit Channel
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {videos.length}
              </p>
              <p className="text-sm text-slate-500">Videos</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {channelData.subscriberCount || 0}
              </p>
              <p className="text-sm text-slate-500">Subscribers</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{totalViews}</p>
              <p className="text-sm text-slate-500">Views</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {channelData.channelsSubscribedToCount || 0}
              </p>
              <p className="text-sm text-slate-500">Subscribed Channels</p>
            </div>
          </div>
        </div>

        {/* Channel Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/upload-video"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-md shadow-sm hover:opacity-90 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Upload Video
          </Link>
          <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
            Customize Channel
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
            Analytics
          </button>
        </div>

        {/* Videos Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Videos</h2>
          {error && videos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-slate-400 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">
                No videos
              </h3>
              <p className="mt-1 text-sm text-slate-600">{error}</p>
              {user?.username === username && (
                <div className="mt-6">
                  <Link
                    to="/upload-video"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-md shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Upload Video
                  </Link>
                </div>
              )}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-slate-400 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">
                No videos
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {user?.username === username
                  ? "You haven't uploaded any videos yet."
                  : "This channel has no published videos."}
              </p>
              {user?.username === username && (
                <div className="mt-6">
                  <Link
                    to="/upload-video"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-md shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Upload Video
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <Link
                  to={`/video/${video._id}`}
                  key={video._id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-900 truncate">
                      {video.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {video.views || 0} views •{" "}
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
