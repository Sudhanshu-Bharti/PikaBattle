import { io } from "../app.js"

class battle{
    constructor(player1,player2,room){
        this.p1 = player1;
        this.p2 = player2;
        this.turn=0; //  0 is for p1 and 1 is for p2
        this.damage={};
        this.room = room;
        console.log("Battle started between "+this.p1+" and "+this.p2);
        
        // let data={
        //     turn:this.turn,
        //     players:{
        //         p1:this.p1,
        //         p2:this.p2
        //     },
        //     damage:[],
        //     status:"started",
        //     log:[]
        // };
        // this.sendData(data)
    }
    
    // sendData(data){
    //     io.to(this.room).emit('battle-update',data);
    // }

    // attack(){
    //     if (this.turn==0){
    //         this.makeAttack(this.p1,"P1");
    //     }else{
    //         setTimeout(()=>{
    //             this.makeAttack(this.p2,"P2")
    //         },500)
    //     }
    //     this.turn=(this.turn+1)%2;
    //     this.addToLog();
    //     this.sendData({status:'waiting'});
    // }


    // makeMove(move,player){
    //     //Checks if the player is in fact playing as that character
    //     if (!this.players[player].inGame()) return false;
        
    //     //Adds the move to the list of moves for that player
    //     this.moves[player]+=move+" ";

    //     //If there are 4 spaces in a row, wins the game
    //     if ((/^s+$/).test(this.moves[player])) {
    //         this.winner("Player "+player.replace(/^\D+/, ''));
    //         return true;
    //     }

    //     //If all squares have been filled and no one has won yet, it's a draw

    // }
    playerTurn=true
    changeTurn=async(data)=>{
        this.turn=(this.turn+1)%2;
        if (this.turn==0){
            this.p1.socket.emit('your-turn',{
                log:this.damage
            })
        }else{
            this.p2.socket.emit('your-turn',{
                log:this.damage
            });
        }
    }
    attack=async(data)=>{
        this.damage=data; 
    }
} 