// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import mongoose from "mongoose";
import express from "express"


// import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";

const app = express()

app.use(express.json({
    limit: "100kb"
}));
dotenv.config({
    path:'./.env'
})
connectDB()
.then(()=>{
    app.listen(process.env.PORT , ()=>{
        console.log(`server is running at port ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed " , err);
    
})


import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);






// import express from "express"
// const app = express()
// (async()=>{
//     try {
//        await mongoose.connect(`${process .env.MONGODB_URL}/${DB_NAME}`)
//        app.on("error",(error)=>{
//         console.log("ERR" , error);
//         throw error
//        })

//        app.listen(process.env.PORT,()=>{
//         console.log(`App is listening on port ${process.env.PORT}`);
        

//        })
//     } catch (error) {
//         console.error("ERROR" , error)
//        throw error 
//     }
// })()