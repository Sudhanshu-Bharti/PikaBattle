import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";

const connectDB=async ()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        // console.log(connectionInstance);
        console.log(`\nMONGODB connected !! DB NAME: ${connectionInstance.connection.host}`);
    } 
    catch (error) {
        console.log("MONGODB error occured: ",error);
        process.exit(1);
    }
}

export default connectDB;