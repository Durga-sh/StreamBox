"use client";

import { useEffect, useState } from "react";
import videoService from "../../services/video.service";
import VideoCard from "./VideoCard";
import { useAuth } from "../../hooks/useAuth";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log("Token in VideoList:", token); // Debug
        const response = await videoService.getAllVideos();

        if (response && response.data && response.data.docs) {
          setVideos(response.data.docs);
        } else if (response && response.data) {
          setVideos(response.data);
        } else {
          // Fallback to sample videos if API doesn't return expected format
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
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(err.message || "Failed to fetch videos");

        // Fallback to sample videos on error
        const sampleVideos = [
          {
            _id: "1",
            title: "Getting Started with StreamBox",
            thumbnail: "https://picsum.photos/seed/video1/800/450",
            views: 1240,
            owner: {
              username: "username",
              avatar: "https://ui-avatars.com/api/?name=User&background=random",
            },
          },
          {
            _id: "2",
            title: "How to Create Engaging Content",
            thumbnail: "https://picsum.photos/seed/video2/800/450",
            views: 856,
            owner: {
              username: "username",
              avatar: "https://ui-avatars.com/api/?name=User&background=random",
            },
          },
          {
            _id: "3",
            title: "Video Editing Tips & Tricks",
            thumbnail: "https://picsum.photos/seed/video3/800/450",
            views: 3210,
            owner: {
              username: "username",
              avatar: "https://ui-avatars.com/api/?name=User&background=random",
            },
          },
        ];
        setVideos(sampleVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <svg
          className="animate-spin h-8 w-8 text-purple-600 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-slate-600">Loading your videos...</p>
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-500 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="mt-4 text-slate-600">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
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
        <h3 className="mt-2 text-sm font-medium text-slate-900">No videos</h3>
        <p className="mt-1 text-sm text-slate-500">
          Get started by uploading your first video.
        </p>
        <div className="mt-6">
          <a
            href="/upload-video"
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
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoList;
