import { Router } from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Create tweet
router.route("/").post(createTweet);

// Get user tweets
router.route("/user/:userId").get(getUserTweets);

// Update and delete tweet
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;
