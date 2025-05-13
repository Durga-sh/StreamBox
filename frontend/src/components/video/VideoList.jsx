import React, { useEffect, useState } from "react";
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
        setVideos(response.data.docs || []);
      } catch (err) {
        setError(err.message || "Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoList;
