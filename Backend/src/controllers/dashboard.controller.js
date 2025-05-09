import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  // Get total videos
  const videosCount = await Video.countDocuments({
    owner: userId,
    isPublished: true,
  });

  // Get total video views
  const videosStats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
        isPublished: true,
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  const totalViews = videosStats[0]?.totalViews || 0;

  // Get total subscribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });

  // Get total likes on videos
  const totalLikes = await Like.countDocuments({
    video: { $exists: true },
    LikeBy: { $ne: userId },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos: videosCount,
        totalViews,
        totalSubscribers,
        totalLikes,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // Get all the videos uploaded by the channel
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const videos = await Video.find({
    owner: userId,
    isPublished: true,
  }).sort({ createdAt: -1 }); // Sort by newest first

  if (!videos || videos.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No videos found for this channel"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
