const mongoose = require("mongoose");


const homeMeasurementRequestSchema =
new mongoose.Schema(
{

    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    tailor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    address:{
        type:Object,
        required:true
    },


    preferredDate:{
        type:Date,
        required:true
    },


    preferredTime:{
        type:String,
        required:true
    },


    note:{
        type:String,
        default:""
    },


    status:{
        type:String,
        enum:[
            "pending",
            "accepted",
            "rejected",
            "completed",
            "cancelled"
        ],
        default:"pending"
    }


},
{
    timestamps:true
});


module.exports =
mongoose.model(
    "HomeMeasurementRequest",
    homeMeasurementRequestSchema
);