import React from "react";
import { useAuth } from "../../hooks/useAuth";

const ChannelInfo = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center">
      {user?.avatar && (
        <img
          src={user.avatar}
          alt="Channel Avatar"
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
      )}
      <div>
        <h2 className="text-xl font-semibold">
          {user?.username || "Channel Name"}
        </h2>
        <p className="text-gray-600">Subscribers: 1,234</p>
      </div>
    </div>
  );
};

export default ChannelInfo;
