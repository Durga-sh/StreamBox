"use client";

import { useState } from "react";
import { Link } from "react-router-dom";

const ChannelPage = () => {
  const [channelData, setChannelData] = useState({
    username: "username",
    fullName: "Your Channel",
    joinedYear: "2023",
    avatar: "https://ui-avatars.com/api/?name=User&background=random",
    coverImage: null,
    description:
      "Share your videos with the world. Create, upload, and discover amazing content.",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Channel Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600 relative">
            {channelData.coverImage && (
              <img
                src={channelData.coverImage || "/placeholder.svg"}
                alt="Channel cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 gap-4">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                <img
                  src={channelData.avatar || "/placeholder.svg"}
                  alt="Channel avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 pt-2">
                <h1 className="text-3xl font-bold text-slate-900">
                  {channelData.fullName}
                </h1>
                <p className="text-slate-600">
                  @{channelData.username} • Joined {channelData.joinedYear}
                </p>
                <p className="mt-2 text-slate-700">{channelData.description}</p>
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
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-500">Videos</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-500">Subscribers</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-500">Views</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">4.2%</p>
              <p className="text-sm text-slate-500">Engagement</p>
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
      </div>
    </div>
  );
};

export default ChannelPage;
