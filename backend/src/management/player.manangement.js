import { v4 as uuidv4 } from 'uuid';
import { io } from '../app.js'; 

const userList=[]; 
const battleRooms=new Map();
const userSocketMap=new Map();


class lobby{
    addUser=async(playerId,username,socket)=>{
        console.log('PlayerId:',playerId);
        userList.forEach((e)=>console.log('playerId:',e.playerId));
        
        // const existingIndex = userList.findIndex(user => user.playerId === playerId);
        const existingIndex = userSocketMap.get(playerId);
        console.log('Existing user:',existingIndex);
        await this.showUsers() 
        if (existingIndex !== undefined) {
            // Update the existing user entry
            for(let room of battleRooms.values()){
                if(room.player1.playerId==playerId){
                    room.player1.socket=socket;
                    room.player1.username=socket.id;
                    socket.join(room.roomId);
                }else if(room.player2.playerId==playerId){
                    room.player2.socket=socket;
                    room.player2.username=socket.id;
                    socket.join(room.roomId);
                }
            }
            userList[existingIndex] = { playerId, username, socket };
            userSocketMap.set(playerId,{ playerId, username, socket });
            
            console.log(`Updated user with playerId ${playerId}`);
        } else {
            // Add a new user entry
            const newPlayer = { playerId, username, socket };
            
            userList.push(newPlayer);
            userSocketMap.set(playerId,{ playerId, username, socket });
            // await this.showUsers();
            await this.matchMaking();  
            // await this.showUsers();  
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
        io.to(id).emit('battle-started',{
            room:id,
            message:`${player1.username} and ${player2.username} started a battle in room id ${id}`
        });
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




