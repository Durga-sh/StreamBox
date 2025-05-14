import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (existingLike) {
    // Unlike the video
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "Video unliked successfully")
      );
  } else {
    // Like the video
    await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: true }, "Video liked successfully")
      );
  }
});

const checkVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { isLiked: !!existingLike }, "Like status checked")
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  // TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  // TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  // TODO: get all liked videos
});

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Aggregate channel statistics
  const stats = await Promise.all([
    // Total videos uploaded by the user
    Video.countDocuments({ owner: userId, isPublished: true }),
    // Total views of all videos by the user
    Video.aggregate([
      { $match: { owner: userId, isPublished: true } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]),
    // Total liked videos by the user
    Like.countDocuments({ likedBy: userId, video: { $exists: true } }),
  ]);

  const [totalVideos, totalViewsResult, totalLikes] = stats;
  const totalViews =
    totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;

  const channelStats = {
    totalVideos,
    totalViews,
    totalLikes,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, channelStats, "Channel stats fetched successfully")
    );
});

export {
  toggleVideoLike,
  checkVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getChannelStats,
};
