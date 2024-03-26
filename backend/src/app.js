import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {createServer} from 'http';
import {Server} from 'socket.io';
import dotenv from 'dotenv';
const app=express();
dotenv.config({
    path:'./.env'
})
console.log(process.env.CORS_ORIGIN);
app.use(cors({
    origin:process.env.CORS_ORIGIN, 
    credentials:true
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

const server=createServer(app);
const io=new Server(server,{
    cors:{
        origin:process.env.CORS_ORIGIN,
        allowedHeaders: ['Content-Type'],
        credentials:true
    }
});

// socket things
io.on('connection',(socket)=>{
    console.log('user '+socket.id);
    
})

//router import 
import playerRouter from '../src/routes/player.routes.js'
//routes declaration
app.use('/',playerRouter);

export {io,server};