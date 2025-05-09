import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Check if the channel (user) exists
  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  // Prevent users from subscribing to themselves
  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  // Check if the user is already subscribed to the channel
  const existingSubscription = await Subscription.findOne({
    susbscriber: req.user._id,
    channel: channelId,
  });

  if (existingSubscription) {
    // If already subscribed, unsubscribe (delete the document)
    await Subscription.findByIdAndDelete(existingSubscription._id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          subscribed: false,
        },
        "Unsubscribed successfully"
      )
    );
  } else {
    // If not subscribed, create a new subscription
    const subscription = await Subscription.create({
      susbscriber: req.user._id,
      channel: channelId,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          subscribed: true,
          subscription,
        },
        "Subscribed successfully"
      )
    );
  }
});

// Controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Check if the channel (user) exists
  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  // Convert page and limit to numbers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate skip value for pagination
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch subscribers with pagination
  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "susbscriber",
        foreignField: "_id",
        as: "subscriber",
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
        subscriber: {
          $first: "$subscriber",
        },
      },
    },
    {
      $project: {
        _id: 1,
        subscriber: 1,
        createdAt: 1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limitNumber,
    },
  ]);

  // Count total subscribers for pagination metadata
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribers,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          totalSubscribers,
          totalPages: Math.ceil(totalSubscribers / limitNumber),
        },
      },
      "Subscribers fetched successfully"
    )
  );
});

// Controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!subscriberId || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  // Check if the subscriber (user) exists
  const subscriber = await User.findById(subscriberId);

  if (!subscriber) {
    throw new ApiError(404, "User not found");
  }

  // Verify that the requesting user is the same as the subscriberId
  if (subscriberId !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "Unauthorized: You can only view your own subscriptions"
    );
  }

  // Convert page and limit to numbers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate skip value for pagination
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch subscribed channels with pagination
  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        susbscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              coverImage: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        channel: {
          $first: "$channel",
        },
      },
    },
    {
      $project: {
        _id: 1,
        channel: 1,
        createdAt: 1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limitNumber,
    },
  ]);

  // Count total subscribed channels for pagination metadata
  const totalSubscribedChannels = await Subscription.countDocuments({
    susbscriber: subscriberId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribedChannels,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          totalSubscribedChannels,
          totalPages: Math.ceil(totalSubscribedChannels / limitNumber),
        },
      },
      "Subscribed channels fetched successfully"
    )
  );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
