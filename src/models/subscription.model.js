import mongoose , {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    susbscriber:{
        type:Schema.Types.ObjectId, // one who is Subscribing
        ref: "User"
    },
    channel:{
        type:Schema.Types.ObjectId, // one whom subscriber is subscribing
        ref: "User"
    }
},{timestamps:true}
)



export const Subscription  = mongoose .model("Subscription" , subscriptionSchema)