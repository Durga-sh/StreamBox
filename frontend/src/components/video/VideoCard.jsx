import React from "react";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  // Format view count with K, M, etc.
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    } else {
      return views.toString();
    }
  };

  // Calculate time since upload
  const getTimeSince = () => {
    // This is a placeholder - in a real app, you'd compare the upload date to current date
    return "3 days ago";
  };

  return (
    <Link to={`/video/${video._id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            12:34
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={
                  video.owner?.avatar ||
                  "https://ui-avatars.com/api/?name=" +
                    (video.owner?.username || "User")
                }
                alt={video.owner?.username || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-slate-900 line-clamp-2 leading-tight mb-1 group-hover:text-purple-600 transition-colors">
                {video.title}
              </h3>
              <p className="text-slate-600 text-sm">
                {video.owner?.username || "Unknown"}
              </p>
              <div className="flex items-center text-xs text-slate-500 mt-1 space-x-1">
                <span>{formatViews(video.views)} views</span>
                <span>•</span>
                <span>{getTimeSince()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
