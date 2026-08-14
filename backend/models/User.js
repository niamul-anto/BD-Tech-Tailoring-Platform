const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
{

name:{
    type:String,
    required:true,
    trim:true
},


email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
},


phone:{
    type:String,
    required:true,
    unique:true
},


password:{
    type:String,
    required:true
},


role:{
    type:String,
    enum:[
        "customer",
        "tailor",
        "delivery",
        "admin"
    ],
    default:"customer"
},


gender:{
    type:String,
    enum:[
        "male",
        "female",
        "other"
    ]
},


profileImage:{
    type:String,
    default:""
},


// ==========================
// USER BLOCK STATUS
// ==========================

isBlocked:{
    type:Boolean,
    default:false
},


isEmailVerified:{
    type:Boolean,
    default:false
},


addresses:[
    {

        title:{
            type:String
        },


        division:{
            type:String
        },


        district:{
            type:String
        },


        area:{
            type:String
        },


        street:{
            type:String
        },


        house:{
            type:String
        },


        postalCode:{
            type:String
        },


        isDefault:{
            type:Boolean,
            default:false
        }

    }
],


createdAt:{
    type:Date,
    default:Date.now
}


},

{
timestamps:true
}

);



module.exports = mongoose.model("User", userSchema);