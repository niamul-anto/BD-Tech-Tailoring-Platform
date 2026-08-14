const mongoose = require("mongoose");


// ==========================
// TOKEN BLACKLIST SCHEMA
// ==========================

const tokenBlacklistSchema = new mongoose.Schema({

    token:{
        type:String,
        required:true,
        unique:true
    },


    expiresAt:{
        type:Date,
        required:true,
        index:{
            expireAfterSeconds:0
        }
    }

},
{
    timestamps:true
});


module.exports = mongoose.model(
    "TokenBlacklist",
    tokenBlacklistSchema
);