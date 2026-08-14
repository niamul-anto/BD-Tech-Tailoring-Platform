const Gig = require("../models/Gig");
const TailorProfile = require("../models/TailorProfile");
const Review = require("../models/Review");

const {
    uploadGigImage
} = require("../utils/uploadToCloudinary");


// ==========================
// HELPER
// ADD TAILOR RATING TO GIGS
// ==========================

const addRatingsToGigs = async(gigs)=>{


    if(!gigs || gigs.length === 0){

        return [];

    }


    // ==========================
    // GET UNIQUE TAILOR IDS
    // ==========================

    const tailorMap = new Map();


    gigs.forEach((gig)=>{


        const tailorId =
            gig.tailor?._id ||
            gig.tailor;


        if(tailorId){

            tailorMap.set(

                tailorId.toString(),

                tailorId

            );

        }


    });



    const tailorIds =
        Array.from(
            tailorMap.values()
        );



    // ==========================
    // GET RATING DATA
    // ==========================

    const ratingData = await Review.aggregate([

        {

            $match:{

                tailor:{

                    $in:tailorIds

                }

            }

        },


        {

            $group:{

                _id:"$tailor",


                averageRating:{

                    $avg:"$rating"

                },


                totalReviews:{

                    $sum:1

                }

            }

        }

    ]);



    // ==========================
    // CREATE RATING MAP
    // ==========================

    const ratingMap = new Map();


    ratingData.forEach((item)=>{


        ratingMap.set(

            item._id.toString(),

            {

                averageRating:
                    item.averageRating || 0,

                totalReviews:
                    item.totalReviews || 0

            }

        );


    });



    // ==========================
    // ADD RATING TO EACH GIG
    // ==========================

    return gigs.map((gig)=>{


        const gigObject =

            typeof gig.toObject === "function"

            ? gig.toObject()

            : gig;



        const tailorId =

            gig.tailor?._id ||
            gig.tailor;



        const rating =

            tailorId

            ? ratingMap.get(
                tailorId.toString()
            )

            : null;



        return {

            ...gigObject,


            averageRating:
                rating?.averageRating || 0,


            totalReviews:
                rating?.totalReviews || 0

        };


    });


};



// ==========================
// CREATE GIG
// ==========================

const createGig = async(req,res)=>{


    try{


        const {

            title,
            category,
            description,
            price,
            deliveryTime,
            images

        } = req.body;




        // ==========================
        // CHECK TAILOR APPROVAL
        // ==========================

        const tailorProfile = await TailorProfile.findOne({

            user:req.user._id

        });



        if(!tailorProfile){

            return res.status(404).json({

                message:"Tailor profile not found"

            });

        }



        if(tailorProfile.verificationStatus !== "approved"){

            return res.status(403).json({

                message:"Only approved tailors can create gigs"

            });

        }




        const gig = await Gig.create({

            tailor:req.user._id,

            title,

            category,

            description,

            price,

            deliveryTime,

            images

        });



        res.status(201).json({

            message:"Gig created successfully",

            gig

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
// GET ALL GIGS
// Public
// Only Approved Tailors
// ==========================

const getAllGigs = async(req,res)=>{

    try{


        // Get approved tailor user IDs

        const approvedTailors = await TailorProfile.find({

            verificationStatus:"approved"

        }).select("user");


        const approvedTailorIds = approvedTailors.map(

            profile => profile.user

        );



        const gigs = await Gig.find({

            tailor:{
                $in:approvedTailorIds
            }

        })
        .populate(
            "tailor",
            "name email"
        );



        // ==========================
        // ADD TAILOR RATINGS
        // ==========================

        const gigsWithRatings =
            await addRatingsToGigs(
                gigs
            );



        res.status(200).json({

            gigs:gigsWithRatings

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
// GET MY GIGS
// Only Logged In Tailor
// ==========================

const getMyGigs = async(req,res)=>{

    try{


        const gigs = await Gig.find({

            tailor:req.user._id

        })
        .populate(
            "tailor",
            "name email"
        )
        .sort({
            createdAt:-1
        });



        res.status(200).json({

            totalGigs:gigs.length,

            gigs

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
// GET SINGLE GIG
// Public
// Only Approved Tailor Gig
// ==========================

const getSingleGig = async(req,res)=>{

    try{


        const gig = await Gig.findById(
            req.params.id
        )
        .populate(
            "tailor",
            "name email"
        );



        if(!gig){

            return res.status(404).json({

                message:"Gig not found"

            });

        }



        // Check tailor verification

        const tailorProfile = await TailorProfile.findOne({

            user:gig.tailor._id,

            verificationStatus:"approved"

        });



        if(!tailorProfile){

            return res.status(404).json({

                message:"Gig not available"

            });

        }



        // ==========================
        // GET TAILOR RATING
        // ==========================

        const reviews = await Review.find({

            tailor:gig.tailor._id

        });



        const totalReviews =
            reviews.length;


        const averageRating =
            totalReviews === 0

            ? 0

            : reviews.reduce(
                (sum,review) =>
                    sum + review.rating,
                0
            ) / totalReviews;



        const gigObject =
            gig.toObject();



        res.status(200).json({

            gig:{

                ...gigObject,

                averageRating,

                totalReviews

            }

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
// UPDATE GIG
// ==========================

const updateGig = async(req,res)=>{

    try{


        const gig = await Gig.findOneAndUpdate(

            {
                _id:req.params.id,

                tailor:req.user._id
            },

            req.body,

            {
                new:true
            }

        );



        if(!gig){


            return res.status(404).json({

                message:"Gig not found"

            });


        }



        res.status(200).json({

            message:"Gig updated successfully",

            gig

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
// DELETE GIG
// ==========================

const deleteGig = async(req,res)=>{

    try{


        const gig = await Gig.findOneAndDelete({

            _id:req.params.id,

            tailor:req.user._id

        });



        if(!gig){


            return res.status(404).json({

                message:"Gig not found"

            });


        }



        res.status(200).json({

            message:"Gig deleted successfully"

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
// SEARCH GIGS
// Public
// Only Approved Tailors
// ==========================

const searchGigs = async(req,res)=>{

try{


    const {
        keyword,
        category,
        minPrice,
        maxPrice
    } = req.query;



    // Get approved tailor IDs

    const approvedTailors = await TailorProfile.find({

        verificationStatus:"approved"

    }).select("user");


    const approvedTailorIds = approvedTailors.map(

        profile => profile.user

    );



    let filter = {

        tailor:{
            $in:approvedTailorIds
        }

    };



    // Search title/category/description

    if(keyword){

        filter.$or = [

            {
                title:{
                    $regex:keyword,
                    $options:"i"
                }
            },

            {
                category:{
                    $regex:keyword,
                    $options:"i"
                }
            },

            {
                description:{
                    $regex:keyword,
                    $options:"i"
                }
            }

        ];

    }



    // Category filter

    if(category){

        filter.category = category;

    }



    // Price filter

    if(minPrice || maxPrice){

        filter.price = {};



        if(minPrice){

            filter.price.$gte = Number(minPrice);

        }



        if(maxPrice){

            filter.price.$lte = Number(maxPrice);

        }

    }



    const gigs = await Gig.find(filter)

    .populate(
        "tailor",
        "name email"
    );



    // ==========================
    // ADD TAILOR RATINGS
    // ==========================

    const gigsWithRatings =
        await addRatingsToGigs(
            gigs
        );



    res.status(200).json({

        gigs:gigsWithRatings

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
// UPLOAD GIG IMAGES
// ==========================

const uploadGigImages = async(req,res)=>{

try{


    const gig = await Gig.findOne({

        _id:req.params.id,

        tailor:req.user._id

    });


    if(!gig){

        return res.status(404).json({

            message:"Gig not found"

        });

    }


    if(!req.files || req.files.length === 0){

        return res.status(400).json({

            message:"Images required"

        });

    }


    const imageUrls = [];


    for(const file of req.files){

        const imageUrl = await uploadGigImage(
            file.buffer
        );

        imageUrls.push(imageUrl);

    }


    gig.images.push(...imageUrls);


    await gig.save();


    res.status(200).json({

        message:"Gig images uploaded successfully",

        images:gig.images

    });


}
catch(error){


    console.log(error);


    res.status(500).json({

        message:"Server error",

        error:error.message

    });


}

};






module.exports = {

    createGig,

    getAllGigs,

    getMyGigs,

    getSingleGig,

    updateGig,

    deleteGig,

    searchGigs,

    uploadGigImages

};