const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    mobile:{
        type:Number,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    
    isBlocked:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Number,
        default:0
    },

},{timestamps : true});

const User = mongoose.model("User",userSchema);
module.exports = User;

