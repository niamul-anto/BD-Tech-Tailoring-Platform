const User = require("../models/User");

const {
    uploadCustomerProfileImage
} = require("../utils/uploadToCloudinary");

// ==========================
// GET USER PROFILE
// ==========================

const getProfile = async(req,res)=>{


    try{


        const user = await User.findById(
            req.user._id
        ).select("-password");



        res.status(200).json({

            user

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
// UPDATE USER PROFILE
// ==========================

const updateProfile = async(req,res)=>{

    try{

        const {
            name,
            phone,
            gender,
            profileImage
        } = req.body;


        const user = await User.findById(
            req.user._id
        );


        if(name)
            user.name = name;


        if(phone)
            user.phone = phone;


        if(gender)
            user.gender = gender;


        if(profileImage)
            user.profileImage = profileImage;



        await user.save();



        res.status(200).json({

            message:"Profile updated successfully",

            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                gender:user.gender,
                profileImage:user.profileImage
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
// UPLOAD CUSTOMER PROFILE IMAGE
// ==========================

const uploadProfileImage = async(req,res)=>{


    try{


        const user = await User.findById(
            req.user._id
        );


        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }



        if(!req.file){

            return res.status(400).json({

                message:"Profile image required"

            });

        }



        const imageUrl =
            await uploadCustomerProfileImage(
                req.file.buffer
            );



        user.profileImage = imageUrl;


        await user.save();



        res.status(200).json({

            message:"Profile image uploaded successfully",

            profileImage:imageUrl

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
// ADD ADDRESS
// ==========================

const addAddress = async(req,res)=>{

    try{


        const {
            title,
            division,
            district,
            area,
            street,
            house,
            postalCode,
            isDefault
        } = req.body;



        const user = await User.findById(
            req.user._id
        );



        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }




        const newAddress = {

            title,
            division,
            district,
            area,
            street,
            house,
            postalCode,
            isDefault:isDefault || false

        };




        // If new address is default,
        // remove default from old addresses

        if(isDefault){

            user.addresses.forEach(address=>{

                address.isDefault = false;

            });

        }



        user.addresses.push(newAddress);



        await user.save();




        res.status(201).json({

            message:"Address added successfully",

            addresses:user.addresses

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
// GET ALL ADDRESSES
// ==========================

const getAddresses = async(req,res)=>{


    try{


        const user = await User.findById(
            req.user._id
        ).select("addresses");



        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }



        res.status(200).json({

            addresses:user.addresses

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
// UPDATE ADDRESS
// ==========================

const updateAddress = async(req,res)=>{

    try{


        const {
            title,
            division,
            district,
            area,
            street,
            house,
            postalCode,
            isDefault
        } = req.body;



        const user = await User.findById(
            req.user._id
        );


        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }




        const address = user.addresses.id(
            req.params.addressId
        );



        if(!address){

            return res.status(404).json({

                message:"Address not found"

            });

        }





        // If setting this address as default

        if(isDefault){


            user.addresses.forEach(item=>{

                item.isDefault = false;

            });


        }




        address.title = title || address.title;
        address.division = division || address.division;
        address.district = district || address.district;
        address.area = area || address.area;
        address.street = street || address.street;
        address.house = house || address.house;
        address.postalCode = postalCode || address.postalCode;


        if(isDefault !== undefined){

            address.isDefault = isDefault;

        }



        await user.save();



        res.status(200).json({

            message:"Address updated successfully",

            address

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
// DELETE ADDRESS
// ==========================

const deleteAddress = async(req,res)=>{


    try{


        const user = await User.findById(
            req.user._id
        );


        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }




        const address = user.addresses.id(
            req.params.addressId
        );



        if(!address){

            return res.status(404).json({

                message:"Address not found"

            });

        }




        address.deleteOne();



        await user.save();




        res.status(200).json({

            message:"Address deleted successfully",

            addresses:user.addresses

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

    getProfile,

    updateProfile,

    uploadProfileImage,

    addAddress,

    getAddresses,

    updateAddress,

    deleteAddress

};
