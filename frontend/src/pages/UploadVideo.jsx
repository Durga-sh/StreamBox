import VideoUpload from "../components/video/VideoUpload";
import { useNavigate } from "react-router-dom";

const UploadVideo = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = (newVideo) => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Upload a New Video
          </h1>
          <p className="mt-2 text-slate-600">
            Share your content with the StreamBox community
          </p>
        </div>
        <VideoUpload onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default UploadVideo;
