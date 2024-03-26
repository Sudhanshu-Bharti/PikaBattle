import mongoose,{Schema} from "mongoose";

const pokemonSchema={
    name:{type:String,required:true},
    imgUrl:{type:String,required:true},
    hp:{type:Number,default:100},
    attacks:[{
        name:{
            type:String,
            required:true
        },
        damage:{
            type:Number || null,
        }
    }],
}

const deckSchema=Schema({
    playerId:{
        type:Schema.Types.ObjectId,  //ref to user
        ref:"Player"
    },
    deck:[pokemonSchema]

},{timeStamps:true})


export const Deck = mongoose.model("Deck",deckSchema);