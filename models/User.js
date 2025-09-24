const mongoose=require('mongoose');
const bcrypt= require("bcryptjs");
const jwt=require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: null,
    }
},{timeStamps: true});

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}

UserSchema.methods.getJWT = async function(){
    const user= this;
    const token= jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
    return token;
}

const User = mongoose.model("User", UserSchema);
module.exports = User;
