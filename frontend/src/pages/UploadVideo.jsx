import React from "react";
import VideoUpload from "../components/video/VideoUpload";
import { useNavigate } from "react-router-dom";

const UploadVideo = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = (newVideo) => {
    navigate("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload a New Video</h1>
      <VideoUpload onUploadSuccess={handleUploadSuccess} />
    </div>
  );
};

export default UploadVideo;
