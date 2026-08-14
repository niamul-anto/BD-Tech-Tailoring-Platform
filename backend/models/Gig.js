const mongoose = require("mongoose");


const gigSchema = new mongoose.Schema({


    // Tailor who created this gig

    tailor: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },


    title: {

        type: String,

        required: true

    },


    category: {

        type: String,

        required: true

    },


    description: {

        type: String,

        required: true

    },


    price: {

        type: Number,

        required: true

    },


    deliveryTime: {

        type: Number,

        required: true

    },


    images: [

        {

            type: String

        }

    ],


    createdAt: {

        type: Date,

        default: Date.now

    }


});


module.exports = mongoose.model(
    "Gig",
    gigSchema
);