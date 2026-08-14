const jwt = require("jsonwebtoken");
const User = require("../models/User");



const authMiddleware = async(req,res,next)=>{


    try{


        // Get token from header

        const authHeader = req.headers.authorization;



        if(!authHeader){

            return res.status(401).json({

                message:"No token provided"

            });

        }





        // Format:
        // Bearer token

        const token = authHeader.split(" ")[1];



        if(!token){

            return res.status(401).json({

                message:"Invalid token format"

            });

        }






        // Verify token

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );


        console.log("DECODED TOKEN:", decoded);





        // Find user

        const user = await User.findById(

            decoded.id

        );




        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }





        // ==========================
        // BLOCKED USER CHECK
        // ==========================

        if(user.isBlocked){

            return res.status(403).json({

                message:"Your account has been blocked"

            });

        }





        // Attach user

        user.password = undefined;

        req.user = user;



        next();



    }


    catch(error){


        console.log(error);


        return res.status(401).json({

            message:"Unauthorized"

        });


    }


};



module.exports = authMiddleware;