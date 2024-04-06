import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {createServer} from 'http';
import {Server} from 'socket.io';
import dotenv from 'dotenv';
import lobby from './management/player.manangement.js';
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
const battleLobby=new lobby;

// socket things
io.on('connection',(socket)=>{
    console.log('user '+socket.id); 
    socket.on('addUser',(res)=>{
        console.log(res);
        battleLobby.addUser(res.playerId,socket.id,socket);
        battleLobby.showUsers();
        battleLobby.matchMaking();  
        battleLobby.showUsers();   
    });
    socket.on('opponent-deck',(res)=>{
        // socket.broadcast.emit('opponent-deck',res);
        socket.broadcast.to(res.room).emit('opponent-deck',res);
        // console.log(socket.rooms);
    });
    socket.on('demand-deck',(res)=>{
        socket.broadcast.emit('demand-deck',res);

    })
    
})

//router import 
import playerRouter from '../src/routes/player.routes.js'
//routes declaration
app.use('/',playerRouter);

export {io,server};