import React from "react";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{video.title}</h3>
          <p className="text-gray-600 text-sm">
            {video.owner?.username || "Unknown"}
          </p>
          <p className="text-gray-500 text-sm">{video.views} views</p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
