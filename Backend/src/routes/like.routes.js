import { Router } from "express";
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getChannelStats,
  getChannelVideos,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Toggle like routes
router.route("/v/:videoId").post(toggleVideoLike);
router.route("/c/:commentId").post(toggleCommentLike);
router.route("/t/:tweetId").post(toggleTweetLike);

// Get liked videos
router.route("/videos").get(getLikedVideos);

// Channel stats and videos
router.route("/stats").get(getChannelStats);
router.route("/videos/channel").get(getChannelVideos);

export default router;
