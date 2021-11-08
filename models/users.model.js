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
    
    bio:{
        type:String,
        default:""

    },

    bio:{
        type:String,
        default:""

    },
    
    gender:{
        type:String,
        default:""

    },
    website:{
        type:String,
        default:""


    },
    profilephoto:{
        type:String,
        default:""


    },
    phone:{
        required:true,
        type:String,

    }
    

});
module.exports=mongoose.model("User",User);