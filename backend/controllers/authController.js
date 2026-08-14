const User = require("../models/User");
const OTP = require("../models/OTP");
const TailorProfile = require("../models/TailorProfile");
const Notification = require("../models/Notification");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

const validatePassword = require("../utils/passwordValidator");
const sendEmail = require("../services/emailService");

const TokenBlacklist = require("../models/TokenBlacklist");



// Email validation function

const validateEmail = (email) => {

    const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return emailRegex.test(email);

};






// ==========================
// REGISTER USER
// ==========================

const registerUser = async(req,res)=>{


    try{


        const {
            name,
            email,
            phone,
            password,
            role,
            gender
        } = req.body;




        // Check required fields

        if(
            !name ||
            !email ||
            !phone ||
            !password
        ){

            return res.status(400).json({

                message:"All required fields must be provided"

            });

        }





        // Email validation

        if(!validateEmail(email)){


            return res.status(400).json({

                message:"Invalid email format"

            });


        }





        // Password validation

        if(!validatePassword(password)){


            return res.status(400).json({

                message:
                "Password must contain minimum 8 characters, uppercase, lowercase, number and special character"

            });


        }






        // Check existing user

        const existingUser = await User.findOne({

            email

        });



        if(existingUser){


            return res.status(400).json({

                message:"Email already registered"

            });


        }





        // Generate OTP

        const otp = otpGenerator.generate(

            6,

            {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            }

        );








        // Remove previous OTP

        await OTP.deleteMany({

            email

        });








        // Save OTP

        await OTP.create({

            email,

            otp,

            expiresAt:
            new Date(Date.now()+5*60*1000)

        });











        // ==========================
        // SEND OTP EMAIL
        // TEST MODE SAFE
        // ==========================

        let emailSent = true;


        try{


            await sendEmail(

                email,

                otp

            );


        }
        catch(emailError){


            emailSent = false;


            console.log(
                "OTP email could not be sent."
            );


            console.log(
                "Testing account email:",
                email
            );


            console.log(
                "Use OTP from MongoDB database for testing."
            );


        }











        return res.status(200).json({

            message:
                emailSent
                ?
                "OTP sent successfully. Please verify your email."
                :
                "OTP created successfully. Email delivery is unavailable for this address. Use the database OTP for testing.",


            email,

            emailSent

        });




    }

    catch(error){


        console.log(error);


        return res.status(500).json({

            message:"Server error"

        });


    }


};










// ==========================
// VERIFY OTP
// ==========================

const verifyOTP = async(req,res)=>{


    try{


        const {

            name,

            email,

            phone,

            password,

            role,

            gender,

            otp

        } = req.body;









        // Find OTP

        const otpRecord = await OTP.findOne({

            email

        });





        if(!otpRecord){


            return res.status(400).json({

                message:"OTP not found"

            });


        }







        // Check OTP expiry

        if(otpRecord.expiresAt < new Date()){


            await OTP.deleteOne({

                email

            });



            return res.status(400).json({

                message:"OTP expired"

            });


        }







        // Match OTP

        if(otpRecord.otp !== otp){


            return res.status(400).json({

                message:"Invalid OTP"

            });


        }







        // Check if user already exists

        const existingUser = await User.findOne({

            email

        });



        if(existingUser){


            return res.status(400).json({

                message:"User already registered"

            });


        }










        // Hash password

        const hashedPassword = await bcrypt.hash(

            password,

            10

        );










        // Create user

        const user = await User.create({

            name,

            email,

            phone,

            password:hashedPassword,

            role,

            gender,

            isEmailVerified:true

        });









        // ==========================
        // CREATE TAILOR PROFILE
        // AUTOMATICALLY
        // ==========================

        if(user.role === "tailor"){

            const existingTailorProfile =
                await TailorProfile.findOne({

                    user:user._id

                });


            if(!existingTailorProfile){

                await TailorProfile.create({

                    user:user._id,

                    shopName:"",

                    experience:0,

                    specialization:[],

                    location:"",

                    description:"",

                    profileImage:"",

                    portfolioImages:[],

                    isProfileComplete:false,

                    verificationStatus:"pending",

                    availabilityStatus:"available"

                });

            }





            // ==========================
            // NOTIFY ALL ADMINS
            // ==========================

            try{


                const admins =
                    await User.find({

                        role:"admin"

                    });



                const io =
                    req.app.get("io");



                for(const admin of admins){


                    const notification =
                        await Notification.create({

                            user:admin._id,

                            message:
                                `New tailor verification request from ${user.name}`,

                            type:"tailor_request"

                        });



                    if(io){

                        io.to(
                            `user_${admin._id}`
                        ).emit(

                            "receive_notification",

                            {

                                _id:
                                    notification._id,

                                user:
                                    admin._id,

                                sender:
                                    user._id,

                                message:
                                    notification.message,

                                type:
                                    notification.type,

                                isRead:
                                    notification.isRead,

                                createdAt:
                                    notification.createdAt

                            }

                        );

                    }


                }


            }
            catch(notificationError){


                console.log(
                    "Admin tailor request notification error:",
                    notificationError
                );


            }


        }









        // Delete OTP after successful verification

        await OTP.deleteOne({

            email

        });











        return res.status(201).json({

            message:
            user.role === "tailor"
            ?
            "Registration completed successfully. Tailor verification is pending."
            :
            "Registration completed successfully",


            user:{

                id:user._id,

                name:user.name,

                email:user.email,

                role:user.role

            }

        });




    }

    catch(error){


        console.log(error);


        return res.status(500).json({

            message:"Server error"

        });


    }


};



// ==========================
// LOGIN USER
// ==========================

const loginUser = async(req,res)=>{


    try{


        const {
            email,
            password
        } = req.body;



        // Check fields

        if(!email || !password){

            return res.status(400).json({

                message:"Email and password required"

            });

        }




        // Find user

        const user = await User.findOne({

            email

        });



        if(!user){


            return res.status(404).json({

                message:"User not found"

            });


        }



        // ==========================
        // BLOCKED USER CHECK
        // ==========================

        if(user.isBlocked === true){

            return res.status(403).json({

                message:"Your account has been blocked"

            });

        }





        // Check password

        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );



        if(!isMatch){


            return res.status(400).json({

                message:"Invalid password"

            });


        }





        // Generate JWT token

        const token = jwt.sign(

            {
                id:user._id,
                role:user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"7d"
            }

        );







        return res.status(200).json({

            message:"Login successful",

            token,


            user:{

                id:user._id,

                name:user.name,

                email:user.email,

                role:user.role

            }

        });




    }

    catch(error){


        console.log(error);


        return res.status(500).json({

            message:"Server error"

        });


    }


};



// ==========================
// LOGOUT
// ==========================

const logout = async(req,res)=>{

    try{

        const authHeader = req.headers.authorization;


        if(!authHeader){

            return res.status(401).json({

                message:"No token provided"

            });

        }


        const token = authHeader.split(" ")[1];


        if(!token){

            return res.status(401).json({

                message:"Invalid token format"

            });

        }


        const decoded = jwt.decode(token);


        if(!decoded || !decoded.exp){

            return res.status(400).json({

                message:"Invalid token"

            });

        }


        const expiresAt =
            new Date(decoded.exp * 1000);


        const alreadyBlacklisted =
            await TokenBlacklist.findOne({

                token

            });


        if(alreadyBlacklisted){

            return res.status(200).json({

                message:"Already logged out"

            });

        }


        await TokenBlacklist.create({

            token,

            expiresAt

        });


        res.status(200).json({

            message:"Logout successful"

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

    registerUser,

    verifyOTP,

    loginUser,

    logout

};