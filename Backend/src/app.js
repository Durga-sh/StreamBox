import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import userRouter from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({
    limit: "100kb"
}));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(express.static("public"));
app.use(cookieParser());

// Register routes
// app.use("/api/users", userRouter);

export { app };