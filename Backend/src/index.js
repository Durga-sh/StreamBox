import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import connectDB from "./db/index.js";
import { app as appImport } from "./app.js";

// Load environment variables
dotenv.config({
  path: "./.env",
});

// Get the app instance - already configured in app.js
const app = appImport;

// Additional middleware specifically for the routes in this file
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());

// Register routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);

// Custom 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

// Connect to database and start server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running at port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed ", err);
  });
