import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const playerSchema=Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },

},{
    timeStamps:true,
});

playerSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password,10);//the number here gives hash round/salt
    next();

})

playerSchema.methods.isPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password);
}
playerSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};
export const Player = mongoose.model("Player",playerSchema);