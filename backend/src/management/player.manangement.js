import { v4 as uuidv4 } from 'uuid';
import { io } from '../app';

const userList=[];
const battleRooms=new Map();

class lobby{
    addUser=async(playerId,socket)=>{
        const newPlayer={
            playerId,
            username,
            socket
        }
        userList.push(newPlayer);
    }
    battle=async(player1,player2)=>{
        const id = uuidv4();
        const room={
            roomId:id,
            player1,
            player2
        }
        battleRooms.set(id,room);
        player1.socket.join(id);
        player2.socket.join(id);
        io.to(id).emit(`${player1.username} and ${player2.username} started a battle`);      
    };
    matchMaking=async()=>{
        if (userList.length < 2) return;
        for(let i=0;i<userList.length-1/2;i++){
            let player1=userList[i];
            let player2=userList[userList.length-1-i];
            this.battle(player1,player2);
        }
    
    };
    battleOver=async(roomId)=>{
        const {player1,player2}=battleRooms.get(roomId);
        player1.socket.leave(roomId);
        player2.socket.leave(roomId);
        for(let i=0;i<userList.length-1;i++){
            if(userList[i]==player1||userList[i]==player2){
                userList.splice(i,1);
            }
        }
        battleRooms.delete(roomId); 

    }

}

export {lobby};




