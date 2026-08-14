const TailorProfile = require("../models/TailorProfile");

const {
    uploadToCloudinary,
    uploadPortfolioImage
} = require("../utils/uploadToCloudinary");


// ==========================
// CREATE TAILOR PROFILE
// ==========================

const createTailorProfile = async(req,res)=>{


    try{


        const {
            shopName,
            experience,
            specialization,
            location,
            description,
            profileImage,
            portfolioImages

        } = req.body;



        const existingProfile =
        await TailorProfile.findOne({

            user:req.user._id

        });



        if(existingProfile){

            return res.status(400).json({

                message:"Tailor profile already exists"

            });

        }




        const profile =
        await TailorProfile.create({

            user:req.user._id,

            shopName,

            experience,

            specialization,

            location,

            description,

            profileImage,

            portfolioImages


        });




        res.status(201).json({

            message:"Tailor profile created successfully",

            profile

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
// GET TAILOR PROFILE
// ==========================

const getTailorProfile = async(req,res)=>{


    try{


        const profile = await TailorProfile.findOne({

            user:req.params.userId

        })
        .populate(
            "user",
            "name email phone gender profileImage"
        );



        if(!profile){

            return res.status(404).json({

                message:"Tailor profile not found"

            });

        }




        res.status(200).json({

            profile

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
// SEARCH TAILORS
// ==========================

const searchTailors = async(req,res)=>{

try{


    const {

        keyword,

        location,

        minExperience,

        specialization

    } = req.query;


    let filter = {

        verificationStatus:"approved"

    };




    // Search by shop name or description

    if(keyword){

        filter.$or = [

            {

                shopName:{

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





    // Location filter

    if(location){

        filter.location = {

            $regex:location,

            $options:"i"

        };

    }





    // Minimum experience filter

    if(minExperience){

        filter.experience = {

            $gte:Number(minExperience)

        };

    }





    // Specialization filter

    if(specialization){

        filter.specialization = {

            $in:[specialization]

        };

    }





    const tailors = await TailorProfile.find(filter)

    .populate(

        "user",

        "name email profileImage"

    );





    res.status(200).json({

        tailors

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
// UPLOAD PROFILE IMAGE
// ==========================

const uploadProfileImage = async(req,res)=>{

try{


    const tailor = await TailorProfile.findOne({

        user:req.user._id

    });



    if(!tailor){

        return res.status(404).json({

            message:"Tailor profile not found"

        });

    }




    if(!req.file){

        return res.status(400).json({

            message:"Image required"

        });

    }




    const imageUrl = await uploadToCloudinary(

        req.file.buffer

    );




    tailor.profileImage = imageUrl;


    await tailor.save();




    res.status(200).json({

        message:"Profile image uploaded successfully",

        profileImage:imageUrl

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
// UPLOAD PORTFOLIO IMAGES
// ==========================

const uploadPortfolioImages = async(req,res)=>{

try{


    const tailor = await TailorProfile.findOne({

        user:req.user._id

    });



    if(!tailor){

        return res.status(404).json({

            message:"Tailor profile not found"

        });

    }



    if(!req.files || req.files.length === 0){

        return res.status(400).json({

            message:"Portfolio images required"

        });

    }



    const imageUrls = [];


    for(const file of req.files){

        const imageUrl = await uploadPortfolioImage(
            file.buffer
        );

        imageUrls.push(imageUrl);

    }



    tailor.portfolioImages.push(...imageUrls);


    await tailor.save();



    res.status(200).json({

        message:"Portfolio images uploaded successfully",

        portfolioImages:tailor.portfolioImages

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




// ==========================
// UPDATE TAILOR PROFILE
// ==========================

const updateTailorProfile = async(req,res)=>{

    try{

        const {

            shopName,
            experience,
            specialization,
            location,
            description

        } = req.body;


        const profile = await TailorProfile.findOne({

            user:req.user._id

        });


        if(!profile){

            return res.status(404).json({

                message:"Tailor profile not found"

            });

        }


        if(shopName !== undefined){

            profile.shopName = shopName;

        }


        if(experience !== undefined){

            profile.experience = experience;

        }


        if(specialization !== undefined){

            profile.specialization = specialization;

        }


        if(location !== undefined){

            profile.location = location;

        }


        if(description !== undefined){

            profile.description = description;

        }


        await profile.save();


        res.status(200).json({

            message:"Tailor profile updated successfully",

            profile

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
// UPDATE AVAILABILITY STATUS
// Only Tailor
// ==========================

const updateAvailability = async(req,res)=>{

    try{


        const {

            availabilityStatus

        } = req.body;



        // ==========================
        // VALIDATE STATUS
        // ==========================

        const allowedStatus = [

            "available",

            "busy",

            "unavailable"

        ];



        if(
            !availabilityStatus ||
            !allowedStatus.includes(
                availabilityStatus
            )
        ){

            return res.status(400).json({

                message:"Invalid availability status"

            });

        }



        // ==========================
        // FIND TAILOR PROFILE
        // ==========================

        const profile =
        await TailorProfile.findOne({

            user:req.user._id

        });



        if(!profile){

            return res.status(404).json({

                message:"Tailor profile not found"

            });

        }



        // ==========================
        // UPDATE AVAILABILITY
        // ==========================

        profile.availabilityStatus =
            availabilityStatus;



        await profile.save();



        res.status(200).json({

            message:
                "Availability updated successfully",

            availabilityStatus:
                profile.availabilityStatus,

            profile

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

    createTailorProfile,

    getTailorProfile,

    updateTailorProfile,

    searchTailors,

    uploadProfileImage,

    uploadPortfolioImages,

    updateAvailability

};