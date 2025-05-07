import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  // Create tweet
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const tweet = await Tweet.create({
    content,
    owner: userId,
  });

  if (!tweet) {
    throw new ApiError(500, "Failed to create tweet");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // Get user tweets
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweets = await Tweet.find({ owner: userId })
    .sort({ createdAt: -1 }) // newest first
    .populate("owner", "username fullName avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  // Update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You don't have permission to update this tweet");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  // Delete tweet
  const { tweetId } = req.params;

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You don't have permission to delete this tweet");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
