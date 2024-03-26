import { Player } from "../models/player.model.js";
import { Deck } from "../models/deck.model.js";

const registerPlayer=async(req,res,next)=>{
    try {
        const {username,password}=req.body;
        if(
            [username,password].some((field)=>field?.trim()==="")
        ){
            throw new Error("All fields are required");
        }
        const existedPlayer=await Player.findOne({username});
        if(existedPlayer){
            throw new Error("Player with email or username already exists");
        }
    
        const player= await Player.create({
            password,
            username
        });
    
        const createdPlayer=await Player.findById(player._id).select(
            "-password"
        ); //it excludes the terms in createdUser
    
        if(!createdPlayer){
            throw new Error("Something went wrong while registering the player");
        }
    
    
        res.status(201).json({
            status:201,
            player:createdPlayer,
            message:"Successfully registered a player",
        })
    } catch (error) {
        next(error);
    }
}

const loginPlayer=async(req,res,next)=>{
    try{
        console.log(req.body);
        const{username,password}=req.body;
        if(!username){
            throw new Error("Username is required");
        }
        const player=await Player.findOne({username});
        if(!player){
            throw new Error("Player does not exist"); 
        }
        
        const isPasswordValid=await player.isPasswordCorrect(password);
        if(!isPasswordValid){
            throw new Error("Invalid User credentials");
        }
        const accessToken=await player.generateAccessToken();
        const loggedInPlayer=await Player.findById(player._id).select("-password");
        const options={
            origin:process.env.CORS_ORIGIN,
            httpOnly:true,
            secure:true,
        }
        return res.status(200).cookie("accessToken",accessToken,options).json({
            user:loggedInPlayer,
            accessToken,
            message:"User logged In succesfully"
        })
    }catch(error){
        next(error)
    }
}



const addPokemon=async(req,res,next)=>{
    try{
        const {playerId,pokemons}=req.body;
        let deck=await Deck.findOne({playerId});
        if(deck){
            deck.deck=[];
            pokemons.forEach((item)=>deck.deck.push(item));
            await deck.save()

        }else{
            deck=await Deck.create({
                playerId,
                deck:pokemons
            });

        }
        res.status(201).json({
            status:201,
            deck:deck,
            message: "Deck added Successfully!"
        })
        
    }catch(error){
        next(error);
    }
}

const getDeck=async(req,res,next)=>{
    try {
        const {playerId}=req.body;
        let deck=await Deck.findOne({playerId});
        if(deck){
            res.status(200).json({   
               status: 200 ,
               data : deck ,
               message:"Deck retrieved succesfully"
           }) 
        }else{
            res.status(404).json({
                status : 404 ,
                message : 'Player not found'
            })  
        } 
    } catch (error) {
        next(error);
    }
}

export {registerPlayer,loginPlayer,addPokemon,getDeck};
