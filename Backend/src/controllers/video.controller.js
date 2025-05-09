import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // Convert page and limit to numbers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Build query object
  const queryObj = {};

  // Add search query if provided
  if (query) {
    queryObj.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  // Add user filter if provided
  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid userId");
    }
    queryObj.owner = userId;
  }

  // Only fetch published videos
  queryObj.isPublished = true;

  // Build sort options
  const sortOptions = {};
  if (sortBy && sortType) {
    sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
  } else {
    // Default sort by createdAt in descending order
    sortOptions.createdAt = -1;
  }

  const videoAggregate = Video.aggregate([
    {
      $match: queryObj,
    },
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
    {
      $sort: sortOptions,
    },
  ]);

  // Apply pagination
  const options = {
    page: pageNumber,
    limit: limitNumber,
  };

  const videos = await Video.aggregatePaginate(videoAggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Validate request data
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  // Check if files are uploaded
  if (
    !req.files ||
    !req.files.videoFile ||
    !req.files.thumbnail ||
    req.files.videoFile.length === 0 ||
    req.files.thumbnail.length === 0
  ) {
    throw new ApiError(400, "Video file and thumbnail are required");
  }

  // Get file paths
  const videoLocalPath = req.files.videoFile[0].path;
  const thumbnailLocalPath = req.files.thumbnail[0].path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video file and thumbnail are required");
  }

  // Upload to cloudinary
  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile || !thumbnail) {
    throw new ApiError(500, "Error uploading files to cloudinary");
  }

  // Get video duration (assuming cloudinary returns this in the response)
  const duration = videoFile.duration;

  // Create video document
  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: duration || 0,
    owner: req.user._id,
    isPublished: true,
  });

  // Fetch the created video to return
  const createdVideo = await Video.findById(video._id).populate(
    "owner",
    "fullName username avatar"
  );

  if (!createdVideo) {
    throw new ApiError(500, "Something went wrong while creating the video");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // Find the video and increment view count in one operation
  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "fullName username avatar");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Add to user's watch history
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { watchHistory: videoId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  if (!title && !description && !req.file) {
    throw new ApiError(400, "At least one field to update is required");
  }

  // Find the video
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if user is the owner
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized: Only owner can update this video");
  }

  // Update data object
  const updateData = {};

  if (title) updateData.title = title;
  if (description) updateData.description = description;

  // Handle thumbnail update if provided
  if (req.file) {
    const thumbnailLocalPath = req.file.path;

    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail file is missing");
    }

    // Upload new thumbnail to cloudinary
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail || !thumbnail.url) {
      throw new ApiError(500, "Error uploading thumbnail to cloudinary");
    }

    // Add thumbnail URL to update data
    updateData.thumbnail = thumbnail.url;

    // TODO: Delete old thumbnail from cloudinary (assignment)
  }

  // Update the video
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: updateData,
    },
    { new: true }
  ).populate("owner", "fullName username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // Find the video
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if user is the owner
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized: Only owner can delete this video");
  }

  // TODO: Delete video and thumbnail from cloudinary (assignment)

  // Delete the video from database
  await Video.findByIdAndDelete(videoId);

  // Remove video from all users' watch history
  await User.updateMany(
    { watchHistory: videoId },
    { $pull: { watchHistory: videoId } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // Find the video
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if user is the owner
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "Unauthorized: Only owner can toggle publish status"
    );
  }

  // Toggle the isPublished status
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video.isPublished,
      },
    },
    { new: true }
  ).populate("owner", "fullName username avatar");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedVideo,
        `Video ${updatedVideo.isPublished ? "published" : "unpublished"} successfully`
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
