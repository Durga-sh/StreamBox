import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import videoService from "../services/video.service";
import { useAuth } from "../hooks/useAuth";

const VideoDetails = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        console.log("Token in VideoDetails:", token); // Debug
        const response = await videoService.getVideoById(videoId);
        setVideo(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch video");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <video
        src={video.videoFile}
        controls
        className="w-full h-96 mb-4"
      ></video>
      <p className="text-gray-700 mb-4">{video.description}</p>
      <div className="flex items-center mb-4">
        <img
          src={video.owner.avatar}
          alt={video.owner.username}
          className="w-10 h-10 rounded-full mr-2"
        />
        <span>{video.owner.username}</span>
      </div>
      <p className="text-gray-500">{video.views} views</p>
    </div>
  );
};

export default VideoDetails;
