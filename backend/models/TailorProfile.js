const mongoose = require("mongoose");


const tailorProfileSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },


    // ==========================
    // SHOP NAME
    // ==========================

    shopName:{
        type:String,
        default:""
    },


    // ==========================
    // EXPERIENCE
    // ==========================

    experience:{
        type:Number,
        default:0
    },


    // ==========================
    // SPECIALIZATION
    // ==========================

    specialization:[{

        type:String

    }],


    // ==========================
    // LOCATION
    // ==========================

    location:{
        type:String,
        default:""
    },


    // ==========================
    // DESCRIPTION
    // ==========================

    description:{
        type:String,
        default:""
    },


    // ==========================
    // PROFILE IMAGE
    // ==========================

    profileImage:{
        type:String,
        default:""
    },


    // ==========================
    // PORTFOLIO IMAGES
    // ==========================

    portfolioImages:[{

        type:String

    }],


    // ==========================
    // PROFILE COMPLETION STATUS
    // ==========================

    isProfileComplete:{
        type:Boolean,
        default:false
    },


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


    // ==========================
    // CREATED AT
    // ==========================

    createdAt:{
        type:Date,
        default:Date.now
    }


});


module.exports = mongoose.model(
    "TailorProfile",
    tailorProfileSchema
);