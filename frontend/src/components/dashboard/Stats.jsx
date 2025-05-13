import React from "react";

const Stats = ({ totalVideos, totalViews }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700">Total Videos</h3>
        <p className="text-2xl font-bold">{totalVideos || 0}</p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700">Total Views</h3>
        <p className="text-2xl font-bold">{totalViews || 0}</p>
      </div>
    </div>
  );
};

export default Stats;
