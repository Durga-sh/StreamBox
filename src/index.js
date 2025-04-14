// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import mongoose from "mongoose";
import express from "express"
import userRouter from "./routes/user.routes.js";

// import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";

const app = express()

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


app.use("/api/v1/users", userRouter);




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