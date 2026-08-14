const mongoose = require("mongoose");


const favoriteSchema = new mongoose.Schema({

    customer:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },


    gig:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Gig",

        required:true

    }

},
{
    timestamps:true
});



// Same customer cannot favorite same gig twice

favoriteSchema.index(
    {
        customer:1,
        gig:1
    },
    {
        unique:true
    }
);


module.exports = mongoose.model(
    "Favorite",
    favoriteSchema
);