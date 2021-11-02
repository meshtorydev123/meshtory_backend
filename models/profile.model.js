const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Profile = Schema({
    name:{
        required:true,
        type:String,

    },
    username:{
        required:true,
        type:String,
        unique:true,

    },
    uid:{
        required:true,
        type:String,
        unique:true,

    },
    bio:{
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

    


    
    
    

});
module.exports=mongoose.model("Profile",Profile);