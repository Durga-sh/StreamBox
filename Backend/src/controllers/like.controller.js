import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle like on video
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the like already exists
  const existingLike = await Like.findOne({
    video: videoId,
    LikeBy: req.user._id,
  });

  if (existingLike) {
    // If already liked, remove the like
    await Like.findByIdAndDelete(existingLike._id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          liked: false,
        },
        "Video unliked successfully"
      )
    );
  } else {
    // If not liked, create a new like
    const like = await Like.create({
      video: videoId,
      LikeBy: req.user._id,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          liked: true,
          like,
        },
        "Video liked successfully"
      )
    );
  }
});

// Toggle like on comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  // Check if comment exists
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if the like already exists
  const existingLike = await Like.findOne({
    comment: commentId,
    LikeBy: req.user._id,
  });

  if (existingLike) {
    // If already liked, remove the like
    await Like.findByIdAndDelete(existingLike._id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          liked: false,
        },
        "Comment unliked successfully"
      )
    );
  } else {
    // If not liked, create a new like
    const like = await Like.create({
      comment: commentId,
      LikeBy: req.user._id,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          liked: true,
          like,
        },
        "Comment liked successfully"
      )
    );
  }
});

// Toggle like on tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  // Check if tweet exists
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  // Check if the like already exists
  const existingLike = await Like.findOne({
    tweet: tweetId,
    LikeBy: req.user._id,
  });

  if (existingLike) {
    // If already liked, remove the like
    await Like.findByIdAndDelete(existingLike._id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          liked: false,
        },
        "Tweet unliked successfully"
      )
    );
  } else {
    // If not liked, create a new like
    const like = await Like.create({
      tweet: tweetId,
      LikeBy: req.user._id,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          liked: true,
          like,
        },
        "Tweet liked successfully"
      )
    );
  }
});

// Get all liked videos by user
const getLikedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Convert page and limit to numbers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate skip value for pagination
  const skip = (pageNumber - 1) * limitNumber;

  const likedVideos = await Like.aggregate([
    {
      $match: {
        LikeBy: new mongoose.Types.ObjectId(req.user._id),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        video: {
          $first: "$video",
        },
      },
    },
    {
      $project: {
        video: 1,
        createdAt: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limitNumber,
    },
  ]);

  // Count total liked videos for pagination metadata
  const totalLikedVideos = await Like.countDocuments({
    LikeBy: req.user._id,
    video: { $exists: true },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        likedVideos,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          totalLikedVideos,
          totalPages: Math.ceil(totalLikedVideos / limitNumber),
        },
      },
      "Liked videos fetched successfully"
    )
  );
});

// Get channel stats
const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  // Get total video views, total subscribers, total videos, total likes
  const totalSubscribers = await mongoose.model("Subscription").countDocuments({
    channel: userId,
  });

  const userVideos = await Video.find({ owner: userId });

  // Calculate total views from user videos
  const totalViews = userVideos.reduce(
    (acc, video) => acc + (video.views || 0),
    0
  );

  // Get total videos
  const totalVideos = userVideos.length;

  // Get total likes on all videos
  const totalLikes = await Like.countDocuments({
    video: { $in: userVideos.map((video) => video._id) },
  });

  // Get total comments on all videos
  const totalComments = await Comment.countDocuments({
    video: { $in: userVideos.map((video) => video._id) },
  });

  // Get total tweets by user
  const totalTweets = await Tweet.countDocuments({ owner: userId });

  // Get likes analytics - last 30 days trend
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const likesAnalytics = await Like.aggregate([
    {
      $match: {
        video: { $in: userVideos.map((video) => video._id) },
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  // Get views analytics - last 30 days (this is a mock as we don't track view date)
  // In a real application, you would have a views collection that stores when a view happened
  const viewsAnalytics = [];

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSubscribers,
        totalViews,
        totalVideos,
        totalLikes,
        totalComments,
        totalTweets,
        likesAnalytics,
        viewsAnalytics,
      },
      "Channel stats fetched successfully"
    )
  );
});

// Get channel videos
const getChannelVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { page = 1, limit = 10 } = req.query;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  // Convert page and limit to numbers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate skip value for pagination
  const skip = (pageNumber - 1) * limitNumber;

  // Get all videos uploaded by the channel with pagination
  const videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$comments" },
      },
    },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        owner: 1,
        createdAt: 1,
        likesCount: 1,
        commentsCount: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limitNumber,
    },
  ]);

  // Count total videos for pagination metadata
  const totalVideos = await Video.countDocuments({ owner: userId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          totalVideos,
          totalPages: Math.ceil(totalVideos / limitNumber),
        },
      },
      "Channel videos fetched successfully"
    )
  );
});

export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getChannelStats,
  getChannelVideos,
};
