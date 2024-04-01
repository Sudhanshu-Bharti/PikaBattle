import { v4 as uuidv4 } from 'uuid';
import { io } from '../app.js'; 

const userList=[]; 
const battleRooms=new Map();

class lobby{
    addUser=async(playerId,username,socket)=>{
        const existingIndex = userList.findIndex(user => user.playerId === playerId);
        if (existingIndex !== -1) {
            // Update the existing user entry
            userList[existingIndex] = { playerId, username, socket };
            console.log(`Updated user with playerId ${playerId}`);
        } else {
            // Add a new user entry
            const newPlayer = { playerId, username, socket };
            userList.push(newPlayer);
            console.log(`Added new user with playerId ${playerId}`);
        }
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
        io.to(id).emit('battle-started',`${player1.username} and ${player2.username} started a battle`);
        let player1_index=userList.indexOf(player1);
        let player2_index=userList.indexOf(player2);
        userList.splice(player1_index,1);
        userList.splice(player2_index-1,1);
    };
    matchMaking=async()=>{
        if (userList.length < 2) return;
        for(let i=0;i<(userList.length-1)/2;i++){
            let player1=userList[i];
            let player2=userList[userList.length-1-i];
            this.battle(player1,player2);
        }
    };
    battleOver=async(roomId)=>{
        const {player1,player2}=battleRooms.get(roomId);
        player1.socket.leave(roomId);
        player2.socket.leave(roomId);
        battleRooms.delete(roomId); 

    };
    showUsers=async()=>{
        // console.log("total list of users:", userList);
        console.log("rooms:",battleRooms);
    }

}

export default lobby;




