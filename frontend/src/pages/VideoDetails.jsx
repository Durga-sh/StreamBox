import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import videoService from "../services/video.service";
import { useAuth } from "../hooks/useAuth";
import CommentSection from "../components/comment/CommentSection";

const VideoDetails = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        console.log("Video ID:", videoId);
        console.log("Token from useAuth:", token);
        const response = await videoService.getVideoById(videoId);
        setVideo(response.data);
        setLikeCount(response.data.likes || 0);

        if (user && token) {
          try {
            const likeStatus = await videoService.checkVideoLike(videoId);
            setIsLiked(likeStatus.data.isLiked);
          } catch (likeError) {
            console.error("Failed to check like status:", likeError);
            setIsLiked(false); // Default to unliked if the check fails
          }
        } else {
          setIsLiked(false);
          console.log("No user or token, skipping like check");
        }
      } catch (err) {
        console.error("Error in fetchVideo:", err);
        setError(err.message || "Failed to fetch video");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId, user, token]);

  const handleLikeToggle = async () => {
    if (!token) {
      setError("Please log in to like the video");
      return;
    }
    try {
      const response = await videoService.toggleVideoLike(videoId);
      setIsLiked(response.data.isLiked);
      setLikeCount((prev) => (response.data.isLiked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error("Error in handleLikeToggle:", err);
      setError(err.message || "Failed to toggle like");
    }
  };

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
        <p className="mt-4 text-slate-600">Loading video...</p>
      </div>
    );
  }

  if (error) {
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

  if (!video) {
    return <div className="text-center py-12">Video not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <video
        src={video.videoFile}
        controls
        className="w-full h-96 mb-4 rounded-lg"
      ></video>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLikeToggle}
            disabled={!token}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked
                ? "bg-purple-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            } ${!token ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill={isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke={isLiked ? "none" : "currentColor"}
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span>{likeCount} Likes</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-gray-500">{video.views} views</p>
          <div className="flex items-center">
            <img
              src={video.owner.avatar}
              alt={video.owner.username}
              className="w-10 h-10 rounded-full mr-2"
            />
            <span className="text-gray-700">{video.owner.username}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-6">{video.description}</p>
      <CommentSection videoId={videoId} />
    </div>
  );
};

export default VideoDetails;
