const mongoose = require("mongoose");


const tailorProfileSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },


    shopName:{
        type:String,
        required:true
    },


    experience:{
        type:Number,
        required:true
    },


    specialization:[{

        type:String

    }],


    location:{
        type:String,
        required:true
    },


    description:{
        type:String
    },


    profileImage:{
        type:String,
        default:""
    },


    portfolioImages:[{

        type:String

    }],


    // ==========================
    // TAILOR VERIFICATION STATUS
    // ==========================

    verificationStatus:{
        type:String,
        enum:[
            "pending",
            "approved",
            "rejected"
        ],
        default:"pending"
    },


    // ==========================
    // TAILOR AVAILABILITY STATUS
    // ==========================

    availabilityStatus:{
        type:String,
        enum:[
            "available",
            "busy",
            "unavailable"
        ],
        default:"available"
    },


    createdAt:{
        type:Date,
        default:Date.now
    }


});


module.exports = mongoose.model(
    "TailorProfile",
    tailorProfileSchema
);