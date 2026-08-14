const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema(
{

    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    tailor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    gig:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Gig",
        required:true
    },


    price:{
        type:Number,
        required:true
    },


    deliveryAddress:{
        type:Object,
        required:true
    },


    measurement:{
        type:Object,
        default:{}
    },


    status:{
        type:String,
        enum:[
            "pending",
            "accepted",
            "processing",
            "completed",
            "cancelled"
        ],
        default:"pending"
    },


    // ==========================
    // ORDER STATUS HISTORY
    // ==========================

    statusHistory:[
        {
            status:{
                type:String,
                enum:[
                    "pending",
                    "accepted",
                    "processing",
                    "completed",
                    "cancelled"
                ],
                required:true
            },

            changedAt:{
                type:Date,
                default:Date.now
            }
        }
    ],


    paymentStatus:{
        type:String,
        enum:[
            "unpaid",
            "paid"
        ],
        default:"unpaid"
    }


},
{
    timestamps:true
}


);


module.exports = mongoose.model(
    "Order",
    orderSchema
);