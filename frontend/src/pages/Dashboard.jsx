"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import videoService from "../services/video.service";
import VideoList from "../components/video/VideoList";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0 });
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, videosData] = await Promise.all([
          videoService.getStats(),
          videoService.getUserVideos(),
        ]);

        setStats({
          totalVideos: statsData.totalVideos || 0,
          totalViews: statsData.totalViews || 0,
        });

        // For demo purposes, create some sample videos if none exist
        if (!videosData || videosData.length === 0) {
          const sampleVideos = [
            {
              _id: "1",
              title: "Getting Started with StreamBox",
              thumbnail: "https://picsum.photos/seed/video1/800/450",
              views: 1240,
              owner: {
                username: "username",
                avatar:
                  "https://ui-avatars.com/api/?name=User&background=random",
              },
            },
            {
              _id: "2",
              title: "How to Create Engaging Content",
              thumbnail: "https://picsum.photos/seed/video2/800/450",
              views: 856,
              owner: {
                username: "username",
                avatar:
                  "https://ui-avatars.com/api/?name=User&background=random",
              },
            },
            {
              _id: "3",
              title: "Video Editing Tips & Tricks",
              thumbnail: "https://picsum.photos/seed/video3/800/450",
              views: 3210,
              owner: {
                username: "username",
                avatar:
                  "https://ui-avatars.com/api/?name=User&background=random",
              },
            },
          ];
          setVideos(sampleVideos);
        } else {
          setVideos(videosData);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-500">
                  Total Videos
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : stats.totalVideos}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-pink-100 text-pink-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-500">
                  Total Views
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : stats.totalViews}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-slate-500">
                  Engagement Rate
                </p>
                <h3 className="text-2xl font-bold text-slate-900">4.2%</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Videos</h2>
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

          <VideoList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
