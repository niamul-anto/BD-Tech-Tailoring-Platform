const cloudinary = require("../config/cloudinary");



// ==========================
// TAILOR PROFILE IMAGE UPLOAD
// ==========================

const uploadToCloudinary = async(fileBuffer)=>{


    return new Promise((resolve,reject)=>{


        cloudinary.uploader.upload_stream(

            {
                folder:"tailor_profiles"
            },


            (error,result)=>{


                if(error){

                    reject(error);

                }

                else{

                    resolve(result.secure_url);

                }


            }


        ).end(fileBuffer);


    });


};






// ==========================
// CUSTOMER PROFILE IMAGE UPLOAD
// ==========================

const uploadCustomerProfileImage = async(fileBuffer)=>{


    return new Promise((resolve,reject)=>{


        cloudinary.uploader.upload_stream(

            {
                folder:"customer_profiles"
            },


            (error,result)=>{


                if(error){

                    reject(error);

                }

                else{

                    resolve(result.secure_url);

                }


            }


        ).end(fileBuffer);


    });


};






// ==========================
// GIG IMAGE UPLOAD
// ==========================

const uploadGigImage = async(fileBuffer)=>{


    return new Promise((resolve,reject)=>{


        cloudinary.uploader.upload_stream(

            {
                folder:"gig_images"
            },


            (error,result)=>{


                if(error){

                    reject(error);

                }

                else{

                    resolve(result.secure_url);

                }


            }


        ).end(fileBuffer);


    });


};






// ==========================
// TAILOR PORTFOLIO IMAGE UPLOAD
// ==========================

const uploadPortfolioImage = async(fileBuffer)=>{


    return new Promise((resolve,reject)=>{


        cloudinary.uploader.upload_stream(

            {
                folder:"tailor_portfolio"
            },


            (error,result)=>{


                if(error){

                    reject(error);

                }

                else{

                    resolve(result.secure_url);

                }


            }


        ).end(fileBuffer);


    });


};






module.exports = {

    uploadToCloudinary,

    uploadCustomerProfileImage,

    uploadGigImage,

    uploadPortfolioImage

};