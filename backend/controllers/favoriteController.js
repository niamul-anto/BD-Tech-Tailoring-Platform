const Favorite = require("../models/Favorite");
const Gig = require("../models/Gig");



// ==========================
// ADD GIG TO FAVORITES
// ==========================

const addFavoriteGig = async(req,res)=>{

try{


    const gig = await Gig.findById(
        req.params.gigId
    );


    if(!gig){

        return res.status(404).json({

            message:"Gig not found"

        });

    }



    const existingFavorite = await Favorite.findOne({

        customer:req.user._id,

        gig:gig._id

    });



    if(existingFavorite){

        return res.status(400).json({

            message:"Gig already added to favorites"

        });

    }



    const favorite = await Favorite.create({

        customer:req.user._id,

        gig:gig._id

    });



    res.status(201).json({

        message:"Gig added to favorites",

        favorite

    });


}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error"

    });


}


};





// ==========================
// GET MY FAVORITE GIGS
// ==========================

const getMyFavoriteGigs = async(req,res)=>{

try{


    const favorites = await Favorite.find({

        customer:req.user._id

    })
    .populate({

        path:"gig",

        populate:{

            path:"tailor",

            select:"name email"

        }

    })
    .sort({

        createdAt:-1

    });



    res.status(200).json({

        favorites

    });


}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error"

    });


}


};





// ==========================
// REMOVE GIG FROM FAVORITES
// ==========================

const removeFavoriteGig = async(req,res)=>{

try{


    const favorite = await Favorite.findOneAndDelete({

        customer:req.user._id,

        gig:req.params.gigId

    });



    if(!favorite){

        return res.status(404).json({

            message:"Favorite not found"

        });

    }



    res.status(200).json({

        message:"Gig removed from favorites"

    });


}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error"

    });


}


};





module.exports = {

    addFavoriteGig,

    getMyFavoriteGigs,

    removeFavoriteGig

};