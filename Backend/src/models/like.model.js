import mongoose, {Schema} from "mongoose";

const LikeSchema = new Schema(
    {
        video:{
            type:String,
            ref:"Video"
        },
        comment:{
            type: Schema.Types.ObjectId,
            ref:"Comment"
        },
        tweet:{
            type:Schema.Types.ObjectId,
            ref:"Tweet"
        },
        LikeBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }     
    },
    {
        timestamps:true
    }
)

export const Like = mongoose.model("Like" , LikeSchema)