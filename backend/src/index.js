import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { server } from "./app.js";

dotenv.config({
    path:'./.env'
})

connectDB().then(()=>{
    server.listen(process.env.PORT||8000,()=>{
        console.log(`server connected at PORT:${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log("MongoDB connection error occcured: ",err);
})