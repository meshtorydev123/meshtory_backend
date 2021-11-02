const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = Schema({
    name:{
        required:true,
        type:String,

    },
    username:{
        required:true,
        type:String,
        unique:true,

    },

    password:{
        required:true,
        type:String,

    },
    

    phone:{
        required:true,
        type:String,

    }
    

});
module.exports=mongoose.model("User",User);