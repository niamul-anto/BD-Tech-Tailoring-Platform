const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema(
{

    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },


    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    paymentMethod:{
        type:String,
        enum:[
            "bkash",
            "nagad"
        ],
        required:true
    },


    paymentStatus:{
        type:String,
        enum:[
            "initiated",
            "paid",
            "failed"
        ],
        default:"initiated"
    },


    paymentId:{
        type:String
    },


    transactionId:{
        type:String
    },


    amount:{
        type:Number,
        required:true
    }


},
{
    timestamps:true
});


module.exports = mongoose.model(
    "Payment",
    paymentSchema
);