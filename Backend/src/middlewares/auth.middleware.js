import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Check for token in cookies first, then Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("Received token in middleware:", token); // Debug

    if (!token) {
      throw new ApiError(401, "Unauthorized request - No token provided");
    }

    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid Access Token - User not found");
      }

      req.user = user;
      next();
    } catch (jwtError) {
      throw new ApiError(401, `Invalid access token: ${jwtError.message}`);
    }
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token");
  }
});